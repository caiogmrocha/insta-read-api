import { Test, TestingModule } from '@nestjs/testing';

import { faker } from '@faker-js/faker';

import { AuthenticateReaderController } from './authenticate-reader.controller';
import { AuthenticateReaderService } from '@/app/services/readers/authenticate-reader/authenticate-reader.service';
import { ReadersRepository } from '@/app/interfaces/repositories/reader.repository';
import { BcryptProvider } from '@/app/interfaces/hash/bcrypt.provider';
import { JwtProvider } from '@/app/interfaces/auth/jwt/jwt.provider';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Reader } from '@/domain/entities/reader';

describe('AuthenticateReaderController', () => {
  let controller: AuthenticateReaderController;
  let readersRepository: jest.Mocked<ReadersRepository>;
  let bcryptProvider: jest.Mocked<BcryptProvider>;
  let jwtProvider: jest.Mocked<JwtProvider>;

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
        {
          provide: JwtProvider,
          useClass: jest.fn().mockImplementation(() => ({
            sign: jest.fn(),
            verify: jest.fn(),
          })),
        },
        AuthenticateReaderService
      ],
      controllers: [AuthenticateReaderController],
    }).compile();

    controller = module.get<AuthenticateReaderController>(AuthenticateReaderController);
    readersRepository = module.get<jest.Mocked<ReadersRepository>>(ReadersRepository);
    bcryptProvider = module.get<jest.Mocked<BcryptProvider>>(BcryptProvider);
    jwtProvider = module.get<jest.Mocked<JwtProvider>>(JwtProvider);
  });

  it('should response with 404 when reader does not exist', async () => {
    // Arrange
    const requestDto = {
      email: faker.internet.email(),
      password: faker.internet.password({ length: 12 }),
    };

    readersRepository.getByEmail.mockResolvedValue(null);

    // Act
    const promise = controller.handle(requestDto);

    // Assert
    await expect(promise).rejects.toThrow(NotFoundException);
  });

  it('should response with 409 when password is invalid', async () => {
    // Arrange
    const requestDto = {
      email: faker.internet.email(),
      password: faker.internet.password({ length: 12 }),
    };

    const mockReader = new Reader({
      id: faker.number.int(),
      name: faker.person.fullName(),
      email: requestDto.email,
      password: faker.internet.password({ length: 12 }),
      createdAt: faker.date.recent(),
      updatedAt: null,
      deletedAt: null,
      deleted: false,
    });

    readersRepository.getByEmail.mockResolvedValue(mockReader);

    bcryptProvider.compare.mockResolvedValue(requestDto.password === mockReader.password);

    // Act
    const promise = controller.handle(requestDto);

    // Assert
    await expect(promise).rejects.toThrow(ConflictException);
  });

  it('should response with 500 status code when an unexpected error occurs', async () => {
    // Arrange
    const requestDto = {
      email: faker.internet.email(),
      password: faker.internet.password({ length: 12 }),
    };

    readersRepository.getByEmail.mockRejectedValue(new Error('Unexpected error'));

    // Act
    const promise = controller.handle(requestDto);

    // Assert
    await expect(promise).rejects.toThrow();
  });

  it('should response with 200 when reader is authenticated', async () => {
    // Arrange
    const requestDto = {
      email: faker.internet.email(),
      password: faker.internet.password({ length: 12 }),
    };

    const mockReader = new Reader({
      id: faker.number.int(),
      name: faker.person.fullName(),
      email: requestDto.email,
      password: requestDto.password,
      createdAt: faker.date.recent(),
      updatedAt: null,
      deletedAt: null,
      deleted: false,
    });

    readersRepository.getByEmail.mockResolvedValue(mockReader);
    bcryptProvider.compare.mockResolvedValue(true);

    const fakeToken = faker.string.uuid();

    jwtProvider.sign.mockResolvedValue(fakeToken);

    // Act
    const response = await controller.handle(requestDto);

    // Assert
    expect(response.token).toEqual(fakeToken);
  });
});
