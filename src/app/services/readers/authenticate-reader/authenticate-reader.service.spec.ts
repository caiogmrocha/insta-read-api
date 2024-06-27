import { Test, TestingModule } from '@nestjs/testing';

import { faker } from '@faker-js/faker';

import { AuthenticateReaderService } from './authenticate-reader.service';
import { ReaderNotFoundException } from '../errors/reader-not-found-exception.error';
import { ReadersRepository } from '@/app/interfaces/repositories/reader.repository';
import { Reader } from '@/domain/entities/reader';
import { InvalidReaderPasswordException } from '../errors/invalid-reader-password-exception.error';
import { BcryptProvider } from '@/app/interfaces/hash/bcrypt.provider';

describe('AuthenticateReaderService', () => {
  let service: AuthenticateReaderService;
  let readersRepository: jest.Mocked<ReadersRepository>;
  let bcryptProvider: jest.Mocked<BcryptProvider>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ReadersRepository,
          useClass: jest.fn().mockImplementation(() => ({
            getByEmail: jest.fn(),
            create: jest.fn(),
          })),
        },
        {
          provide: BcryptProvider,
          useClass: jest.fn().mockImplementation(() => ({
            compare: jest.fn(),
            hash: jest.fn(),
          })),
        },
        AuthenticateReaderService
      ],
    }).compile();

    service = module.get<AuthenticateReaderService>(AuthenticateReaderService);
    readersRepository = module.get<jest.Mocked<ReadersRepository>>(ReadersRepository);
    bcryptProvider = module.get<jest.Mocked<BcryptProvider>>(BcryptProvider);
  });

  it('should throw ReaderNotFoundException when reader does not exist', async () => {
    // Arrange
    const params = {
      email: faker.internet.email(),
      password: faker.internet.password({ length: 12 }),
    };

    readersRepository.getByEmail.mockResolvedValue(null);

    // Act
    const promise = service.execute(params);

    // Assert
    await expect(promise).rejects.toThrow(ReaderNotFoundException);
  });

  it('should throw InvalidReaderPasswordException when password does not match', async () => {
    // Arrange
    const params = {
      email: faker.internet.email(),
      password: faker.internet.password({ length: 12 }),
    };

    const mockReader = new Reader({
      id: faker.number.int(),
      name: faker.person.fullName(),
      email: params.email,
      password: faker.internet.password({ length: 12 }),
      createdAt: faker.date.recent(),
      updatedAt: null,
      deletedAt: null,
      deleted: false,
    });

    readersRepository.getByEmail.mockResolvedValue(mockReader);


    bcryptProvider.compare.mockResolvedValue(params.password === mockReader.password);

    // Act
    const promise = service.execute(params);

    // Assert
    await expect(promise).rejects.toThrow(InvalidReaderPasswordException);
  });

  it.todo('should return a valid token when reader is authenticated');
});
