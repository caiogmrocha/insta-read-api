import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';

import { CreateReaderAccountService } from './create-reader-account.service';
import { ReaderEmailAlreadyExistsException } from '../errors/reader-email-already-exists.error';
import { ReaderRepository } from '../../interfaces/repositories/reader-repository';
import { Reader } from '../../../domain/entities/reader';

describe('CreateReaderAccountService', () => {
  let service: CreateReaderAccountService;
  let readerRepository: jest.Mocked<ReaderRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ReaderRepository,
          useClass: jest.fn().mockImplementation(() => ({
            getByEmail: jest.fn().mockResolvedValue({}),
          })),
        },
        CreateReaderAccountService,
      ],
    }).compile();

    service = module.get<CreateReaderAccountService>(CreateReaderAccountService);
    readerRepository = module.get<jest.Mocked<ReaderRepository>>(ReaderRepository);
  });

  it('should create a new reader account', async () => {
    // Arrange
    readerRepository.getByEmail.mockResolvedValue(null);

    const params = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 12 }),
    };

    // Act
    await service.execute(params);

    // Assert
    expect(readerRepository.getByEmail).resolves.toBeUndefined();
  });

  it('should throw ReaderEmailAlreadyExistsException when email already exists', async () => {
    // Arrange
    const params = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 12 }),
    };

    readerRepository.getByEmail.mockResolvedValue(new Reader({
      id: faker.number.int(),
      name: params.name,
      email: params.email,
      password: params.password,
      createdAt: faker.date.recent(),
      updatedAt: faker.date.recent(),
      deletedAt: null,
      deleted: false,
    }));

    // Act
    const promise = service.execute(params);

    // Assert
    await expect(promise).rejects.toThrow(new ReaderEmailAlreadyExistsException(params.email));
  });
});
