import { Test, TestingModule } from '@nestjs/testing';

import { faker } from '@faker-js/faker';

import { AutheticateAdminService } from './autheticate-admin.service';
import { AdminNotFoundException } from '../errors/admin-not-found.exception';
import { AdminsRepository } from '@/app/interfaces/repositories/admins.repository';

describe('AutheticateAdminService', () => {
  let service: AutheticateAdminService;
  let adminsRepository: jest.Mocked<AdminsRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AdminsRepository,
          useClass: jest.fn().mockImplementation(() => ({
            getByEmail: jest.fn(),
          })),
        },
        AutheticateAdminService
      ],
    }).compile();

    service = module.get<AutheticateAdminService>(AutheticateAdminService);
    adminsRepository = module.get<jest.Mocked<AdminsRepository>>(AdminsRepository);
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

  it.todo('should throw InvalidAdminPasswordException when password does not match');
  it.todo('should return a valid token when admin is authenticated');
});
