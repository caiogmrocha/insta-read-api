import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, InternalServerErrorException, UnprocessableEntityException } from '@nestjs/common';

import { faker } from '@faker-js/faker';

import { CreateReaderAccountController } from './create-reader-account.controller';
import { CreateReaderAccountService } from '@/app/services/readers/create-reader-account/create-reader-account.service';
import { BcryptProvider } from '@/app/interfaces/hash/bcrypt.provider';
import { ReadersRepository } from '@/app/interfaces/repositories/reader.repository';
import { Reader } from '@/domain/entities/reader';

describe('CreateReaderAccountController', () => {
  let controller: CreateReaderAccountController;
  let readerRepository: jest.Mocked<ReadersRepository>;

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
      controllers: [CreateReaderAccountController],
    }).compile();

    controller = module.get<CreateReaderAccountController>(CreateReaderAccountController);
    readerRepository = module.get<jest.Mocked<ReadersRepository>>(ReadersRepository);
  });

  it('should response with 201 status code when reader account is created', async () => {
    // Arrange
    const requestDto = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 12 }),
    };

    // Act
    const response = await controller.handle(requestDto);

    // Assert
    expect(response).toBeUndefined();
  });

  it('should response with 409 status code when reader email already exists', async () => {
    // Arrange
    const requestDto = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 12 }),
    };

    readerRepository.getByEmail.mockResolvedValue(new Reader({
      name: requestDto.name,
      email: requestDto.email,
      password: requestDto.password,
    }));


    // Act
    const response = controller.handle(requestDto);

    // Assert
    await expect(response).rejects.toThrow(ConflictException);
  });

  it('should response with 500 status code when an unexpected error occurs', async () => {
    // Arrange
    const requestDto = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 12 }),
    };

    readerRepository.getByEmail.mockRejectedValue(new Error('Unexpected error'));

    // Act
    const response = controller.handle(requestDto);

    // Assert
    await expect(response).rejects.toThrow(InternalServerErrorException);
  });
});
