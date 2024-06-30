import { Test, TestingModule } from '@nestjs/testing';
import { UpdateReaderAccountController } from './update-reader-account.controller';
import { ReadersRepository } from '@/app/interfaces/repositories/reader.repository';
import { UpdateReaderAccountService } from '@/app/services/readers/update-reader-account/update-reader-account.service';
import { NotFoundException } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { UpdateReaderAccountBodyDto, UpdateReaderAccountParamsDto } from './update-reader-account.dto';

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

  it.todo('should response with 409 when email already exists');
  it.todo('should response with 204 when reader updated');
});
