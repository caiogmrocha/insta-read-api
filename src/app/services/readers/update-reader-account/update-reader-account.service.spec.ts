import { Test, TestingModule } from '@nestjs/testing';
import { UpdateReaderAccountService, UpdateReaderAccountServiceParams } from './update-reader-account.service';
import { ReaderNotFoundException } from '../errors/reader-not-found.exception';
import { faker } from '@faker-js/faker';
import { ReadersRepository } from '@/app/interfaces/repositories/reader.repository';
import { Reader } from '@/domain/entities/reader';
import { ReaderEmailAlreadyExistsException } from '../errors/reader-email-already-exists.exception';

describe('UpdateReaderAccountService', () => {
  let service: UpdateReaderAccountService;
  let readersRepository: jest.Mocked<ReadersRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ReadersRepository,
          useClass: jest.fn().mockImplementation((): jest.Mocked<Partial<ReadersRepository>> => ({
            getById: jest.fn(),
            getByEmail: jest.fn(),
            update: jest.fn(),
          })),
        },
        UpdateReaderAccountService,
      ],
    }).compile();

    service = module.get<UpdateReaderAccountService>(UpdateReaderAccountService);
    readersRepository = module.get<jest.Mocked<ReadersRepository>>(ReadersRepository);
  });

  it('should throw ReaderNotFoundException when reader not found', async () => {
    // Arrange
    const params: UpdateReaderAccountServiceParams = {
      id: faker.number.int(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    readersRepository.getById.mockResolvedValue(null);

    // Act
    const promise = service.execute(params);

    // Assert
    await expect(promise).rejects.toThrow(ReaderNotFoundException);
  });

  it('should throw ReaderEmailAlreadyExistsException when email already exists', async () => {
    // Arrange
    const params: UpdateReaderAccountServiceParams = {
      id: faker.number.int(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const readerToBeUpdated = new Reader({
      id: params.id,
      name: params.name,
      email: params.email,
      password: params.password,
    });

    readersRepository.getById.mockResolvedValue(readerToBeUpdated);

    params.email = faker.internet.email();

    const readerWithSameEmail = new Reader({
      id: faker.number.int(),
      name: faker.person.fullName(),
      email: params.email,
      password: faker.internet.password({ length: 12 }),
    });

    readersRepository.getByEmail.mockResolvedValue(readerWithSameEmail);

    // Act
    const promise = service.execute(params);

    // Assert
    await expect(promise).rejects.toThrow(ReaderEmailAlreadyExistsException);
  });

  it('should update the reader account', async () => {
    // Arrange
    const params: UpdateReaderAccountServiceParams = {
      id: faker.number.int(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const readerToBeUpdated = new Reader({
      id: params.id,
      name: params.name,
      email: params.email,
      password: params.password,
    });

    readersRepository.getById.mockResolvedValue(readerToBeUpdated);
    readersRepository.getByEmail.mockResolvedValue(null);

    // Act
    await service.execute(params);

    // Assert
    expect(readersRepository.update).toHaveBeenCalledWith(readerToBeUpdated);
  });
});
