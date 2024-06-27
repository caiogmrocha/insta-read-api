import { Test, TestingModule } from '@nestjs/testing';

import { faker } from '@faker-js/faker';

import { AuthenticateReaderService } from './authenticate-reader.service';
import { ReaderNotFoundException } from '../errors/reader-not-found-exception.error';
import { ReadersRepository } from '@/app/interfaces/repositories/reader.repository';

describe('AuthenticateReaderService', () => {
  let service: AuthenticateReaderService;
  let readersRepository: jest.Mocked<ReadersRepository>;

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
        AuthenticateReaderService
      ],
    }).compile();

    service = module.get<AuthenticateReaderService>(AuthenticateReaderService);
    readersRepository = module.get<jest.Mocked<ReadersRepository>>(ReadersRepository);
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

  it.todo('should throw InvalidReaderPasswordException when password does not match');
  it.todo('should return a valid token when reader is authenticated');
});
