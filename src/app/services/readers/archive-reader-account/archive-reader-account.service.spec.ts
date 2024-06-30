import { Test, TestingModule } from '@nestjs/testing';

import { ArchiveReaderAccountService } from './archive-reader-account.service';
import { ReadersRepository } from '@/app/interfaces/repositories/reader.repository';
import { faker } from '@faker-js/faker';
import { ReaderNotFoundException } from '../errors/reader-not-found.exception';
import { Reader } from '@/domain/entities/reader';
import { ReaderAlreadyArchivedException } from '../errors/reader-already-archived.exception';

describe('ArchiveReaderAccountService', () => {
  let service: ArchiveReaderAccountService;
  let readersRepository: jest.Mocked<ReadersRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ReadersRepository,
          useClass: jest.fn().mockImplementation(() => ({
            getById: jest.fn(),
            update: jest.fn(),
          })),
        },
        ArchiveReaderAccountService,
      ],
    }).compile();

    service = module.get<ArchiveReaderAccountService>(ArchiveReaderAccountService);
    readersRepository = module.get<jest.Mocked<ReadersRepository>>(ReadersRepository);
  });

  it('should throw ReaderNotFound exception if reader not found', async () => {
    // Arrange
    const params = {
      id: faker.number.int(),
    };

    readersRepository.getById.mockResolvedValue(null);

    // Act
    const promise = service.execute(params);

    // Assert
    await expect(promise).rejects.toThrow(ReaderNotFoundException);
  });

  it('should throw ReaderAlreadyArchived exception if reader already archived', async () => {
    // Arrange
    const params = {
      id: faker.number.int(),
    };

    const reader = new Reader({
      id: params.id,
      isArchived: true,
      archivedAt: faker.date.recent(),
    });

    readersRepository.getById.mockResolvedValue(reader);

    // Act
    const promise = service.execute(params);

    // Assert
    await expect(promise).rejects.toThrow(ReaderAlreadyArchivedException);
  });

  it.todo('should archive reader account');
});
