import { Test, TestingModule } from '@nestjs/testing';

import { CreateReaderAccountController } from './create-reader-account.controller';
import { BcryptProvider } from '@/app/interfaces/hash/bcrypt.provider';
import { ReaderRepository } from '@/app/interfaces/repositories/reader.repository';
import { CreateReaderAccountService } from '@/app/services/readers/create-reader-account/create-reader-account.service';

describe('CreateReaderAccountController', () => {
  let controller: CreateReaderAccountController;

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
          provide: ReaderRepository,
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
  });

  it('should response with 201 status code when reader account is created', async () => {
    // Arrange
    const requestDto = {
      name: 'John Doe',
      email: 'email@email.com',
      password: 'password',
    };

    // Act
    const response = await controller.handle(requestDto);

    // Assert
    expect(response).toBeUndefined();
  });
  it.todo('should response with 409 status code when reader email already exists');
  it.todo('should response with 500 status code when an unexpected error occurs');
});
