import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';

import { faker } from '@faker-js/faker';

import { UpdateReaderAccountController } from './update-reader-account.controller';
import { UpdateReaderAccountService } from '@/app/services/readers/update-reader-account/update-reader-account.service';
import { Reader } from '@/domain/entities/reader';
import { ReadersRepository } from '@/app/interfaces/repositories/reader.repository';
import { UpdateReaderAccountBodyDto, UpdateReaderAccountParamsDto } from './update-reader-account.dto';
import { JwtProvider } from '@/app/interfaces/auth/jwt/jwt.provider';

describe('UpdateReaderAccountController', () => {
  let controller: UpdateReaderAccountController;
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
        {
          provide: JwtProvider,
          useClass: jest.fn().mockImplementation(() => ({})),
        },
        UpdateReaderAccountService,
      ],
      controllers: [UpdateReaderAccountController],
    }).compile();

    controller = module.get<UpdateReaderAccountController>(UpdateReaderAccountController);
    readersRepository = module.get<jest.Mocked<ReadersRepository>>(ReadersRepository);
  });

  it('should response with 404 when reader not found', async () => {
    // Arrange
    const params: UpdateReaderAccountParamsDto = {
      id: faker.number.int(),
    };

    const body: UpdateReaderAccountBodyDto = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    }

    readersRepository.getById.mockResolvedValue(null);

    // Act
    const promise = controller.handle(params, body);

    // Assert
    await expect(promise).rejects.toThrow(NotFoundException);
  });

  it('should response with 409 when email already exists', async () => {
    // Arrange
    const params: UpdateReaderAccountParamsDto = {
      id: faker.number.int(),
    };

    const body: UpdateReaderAccountBodyDto = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    }

    const readerToBeUpdated = new Reader({
      id: params.id,
      name: body.name,
      email: body.email,
      password: body.password,
    });

    readersRepository.getById.mockResolvedValue(readerToBeUpdated);

    body.email = faker.internet.email();

    const readerWithSameEmail = new Reader({
      id: faker.number.int(),
      name: faker.person.fullName(),
      email: body.email,
      password: faker.internet.password({ length: 12 }),
    });

    readersRepository.getByEmail.mockResolvedValue(readerWithSameEmail);

    // Act
    const promise = controller.handle(params, body);

    // Assert
    await expect(promise).rejects.toThrow(ConflictException);

  });

  it('should response with 204 when reader updated', async () => {
    // Arrange
    const params: UpdateReaderAccountParamsDto = {
      id: faker.number.int(),
    };

    const body: UpdateReaderAccountBodyDto = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const readerToBeUpdated = new Reader({
      id: params.id,
      name: body.name,
      email: body.email,
      password: body.password,
    });

    readersRepository.getById.mockResolvedValue(readerToBeUpdated);
    readersRepository.getByEmail.mockResolvedValue(null);

    // Act
    const promise = controller.handle(params, body);

    // Assert
    await expect(promise).resolves.toBeUndefined();
  });
});
