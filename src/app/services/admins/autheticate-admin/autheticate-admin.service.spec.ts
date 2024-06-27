import { Test, TestingModule } from '@nestjs/testing';

import { faker } from '@faker-js/faker';

import { AutheticateAdminService } from './autheticate-admin.service';
import { AdminNotFoundException } from '../errors/admin-not-found.exception';
import { AdminsRepository } from '@/app/interfaces/repositories/admins.repository';
import { Admin } from '@/domain/entities/admin';
import { InvalidAdminPasswordException } from '../errors/invalid-admin-password.exception';
import { BcryptProvider } from '@/app/interfaces/hash/bcrypt.provider';
import { JwtProvider } from '@/app/interfaces/auth/jwt/jwt.provider';

describe('AutheticateAdminService', () => {
  let service: AutheticateAdminService;
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
        AutheticateAdminService
      ],
    }).compile();

    service = module.get<AutheticateAdminService>(AutheticateAdminService);
    adminsRepository = module.get<jest.Mocked<AdminsRepository>>(AdminsRepository);
    bcryptProvider = module.get<jest.Mocked<BcryptProvider>>(BcryptProvider);
    jwtProvider = module.get<jest.Mocked<JwtProvider>>(JwtProvider);
  });

  it('should throw AdminNotFoundException when reader does not exist', async () => {
    // Arrange
    const params = {
      email: faker.internet.email(),
      password: faker.internet.password({ length: 12 }),
    };

    adminsRepository.getByEmail.mockResolvedValue(null);

    // Act
    const promise = service.execute(params);

    // Assert
    await expect(promise).rejects.toThrow(AdminNotFoundException);
  });

  it('should throw InvalidAdminPasswordException when password does not match', async () => {
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
    const promise = service.execute(params);

    // Assert
    await expect(promise).rejects.toThrow(InvalidAdminPasswordException);
  });

  it('should return a valid token when admin is authenticated', async () => {
    // Arrange
    const params = {
      email: faker.internet.email(),
      password: faker.internet.password({ length: 12 }),
    };

    const mockAdmin = new Admin({
      email: params.email,
      password: params.password,
    });

    adminsRepository.getByEmail.mockResolvedValue(mockAdmin);

    bcryptProvider.compare.mockResolvedValue(params.password === mockAdmin.password);

    jwtProvider.sign.mockResolvedValue(faker.string.uuid());

    // Act
    const result = await service.execute(params);

    // Assert
    expect(result).toEqual({ token: expect.any(String) });
  });
});
