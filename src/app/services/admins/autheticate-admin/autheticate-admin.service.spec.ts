import { Test, TestingModule } from '@nestjs/testing';

import { faker } from '@faker-js/faker';

import { AutheticateAdminService } from './autheticate-admin.service';
import { AdminNotFoundException } from '../errors/admin-not-found.exception';
import { AdminsRepository } from '@/app/interfaces/repositories/admins.repository';
import { Admin } from '@/domain/entities/admin';
import { InvalidAdminPasswordException } from '../errors/invalid-admin-password.exception';
import { BcryptProvider } from '@/app/interfaces/hash/bcrypt.provider';

describe('AutheticateAdminService', () => {
  let service: AutheticateAdminService;
  let adminsRepository: jest.Mocked<AdminsRepository>;
  let bcryptProvider: jest.Mocked<BcryptProvider>;

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
        AutheticateAdminService
      ],
    }).compile();

    service = module.get<AutheticateAdminService>(AutheticateAdminService);
    adminsRepository = module.get<jest.Mocked<AdminsRepository>>(AdminsRepository);
    bcryptProvider = module.get<jest.Mocked<BcryptProvider>>(BcryptProvider);
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

  it.todo('should return a valid token when admin is authenticated');
});
