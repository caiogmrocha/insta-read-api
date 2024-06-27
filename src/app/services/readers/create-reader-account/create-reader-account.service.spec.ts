import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';

import { CreateReaderAccountService } from './create-reader-account.service';
import { ReaderEmailAlreadyExistsException } from '../errors/reader-email-already-exists.error';
import { ReadersRepository } from '../../../interfaces/repositories/reader.repository';
import { BcryptProvider } from '../../../interfaces/hash/bcrypt.provider';
import { Reader } from '../../../../domain/entities/reader';

describe('CreateReaderAccountService', () => {
  let service: CreateReaderAccountService;
  let readerRepository: jest.Mocked<ReadersRepository>;
  let bcryptProvider: jest.Mocked<BcryptProvider>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: BcryptProvider,
          useClass: jest.fn().mockImplementation(() => ({
            hash: jest.fn(),
            compare: jest.fn(),
          })),
        },
        {
          provide: ReadersRepository,
          useClass: jest.fn().mockImplementation(() => ({
            getByEmail: jest.fn(),
            create: jest.fn(),
          })),
        },
        CreateReaderAccountService,
      ],
    }).compile();

    service = module.get<CreateReaderAccountService>(CreateReaderAccountService);
    readerRepository = module.get<jest.Mocked<ReadersRepository>>(ReadersRepository);
    bcryptProvider = module.get<jest.Mocked<BcryptProvider>>(BcryptProvider);
  });

  it('should create a new reader account', async () => {
    // Arrange
    const params = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 12 }),
    };

    readerRepository.getByEmail.mockResolvedValue(null);
    bcryptProvider.hash.mockResolvedValue(params.password);

    // Act
    const promise = service.execute(params);

    // Assert
    await expect(promise).resolves.toBeUndefined();
    expect(readerRepository.getByEmail).toHaveBeenCalled();
    expect(readerRepository.create).toHaveBeenCalled();
    expect(bcryptProvider.hash).toHaveBeenCalled();
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
