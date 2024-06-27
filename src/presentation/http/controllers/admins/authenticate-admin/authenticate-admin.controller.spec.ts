import { Test, TestingModule } from '@nestjs/testing';

import { faker } from '@faker-js/faker';

import { AuthenticateAdminController } from './authenticate-admin.controller';
import { AuthenticateAdminService } from '@/app/services/admins/authenticate-admin/authenticate-admin.service';
import { AdminsRepository } from '@/app/interfaces/repositories/admins.repository';
import { BcryptProvider } from '@/app/interfaces/hash/bcrypt.provider';
import { JwtProvider } from '@/app/interfaces/auth/jwt/jwt.provider';
import { ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Admin } from '@/domain/entities/admin';

describe('AuthenticateAdminController', () => {
  let controller: AuthenticateAdminController;
  let service: AuthenticateAdminService;
  let adminsRepository: jest.Mocked<AdminsRepository>;
  let bcryptProvider: jest.Mocked<BcryptProvider>;
  let jwtProvider: jest.Mocked<JwtProvider>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AdminsRepository,
          useClass: jest.fn().mockImplementation(() => ({
            getByEmail: jest.fn(),
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
        AuthenticateAdminService
      ],
      controllers: [AuthenticateAdminController],
    }).compile();

    controller = module.get<AuthenticateAdminController>(AuthenticateAdminController);
    adminsRepository = module.get<jest.Mocked<AdminsRepository>>(AdminsRepository);
    bcryptProvider = module.get<jest.Mocked<BcryptProvider>>(BcryptProvider);
    jwtProvider = module.get<jest.Mocked<JwtProvider>>(JwtProvider);
  });

  it('should response with 404 when admin does not exist', async () => {
    // Arrange
    const params = {
      email: faker.internet.email(),
      password: faker.internet.password({ length: 12 }),
    };

    adminsRepository.getByEmail.mockResolvedValue(null);

    // Act
    const promise = controller.handle(params);

    // Assert
    await expect(promise).rejects.toBeInstanceOf(NotFoundException);
  });

  it('should response with 409 when password is invalid', async () => {
    // Arrange
    const params = {
      email: faker.internet.email(),
      password: faker.internet.password({ length: 12 }),
    };

    const mockAdmin = new Admin({
      email: params.email,
      password: faker.internet.password({ length: 12 }),
    });

    adminsRepository.getByEmail.mockResolvedValue(mockAdmin);

    bcryptProvider.compare.mockResolvedValue(params.password === mockAdmin.password);

    // Act
    const promise = controller.handle(params);

    // Assert
    await expect(promise).rejects.toBeInstanceOf(ConflictException);
  });

  it('should response with 500 status code when an unexpected error occurs', async () => {
    // Arrange
    const params = {
      email: faker.internet.email(),
      password: faker.internet.password({ length: 12 }),
    };

    adminsRepository.getByEmail.mockRejectedValue(new Error());

    // Act
    const promise = controller.handle(params);

    // Assert
    await expect(promise).rejects.toBeInstanceOf(InternalServerErrorException);
  });

  it.todo('should response with 200 when admin is authenticated');
});
