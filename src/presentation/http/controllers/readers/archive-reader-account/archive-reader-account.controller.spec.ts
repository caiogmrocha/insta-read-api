import { Test, TestingModule } from '@nestjs/testing';
import { ArchiveReaderAccountController } from './archive-reader-account.controller';
import { ReadersRepository } from '@/app/interfaces/repositories/reader.repository';
import { ArchiveReaderAccountService } from '@/app/services/readers/archive-reader-account/archive-reader-account.service';
import { ArchiveReaderAccountParamsDto } from './archive-reader-account.dto';
import { Reader } from '@/domain/entities/reader';
import { ConflictException } from '@nestjs/common';

describe('ArchiveReaderAccountController', () => {
  let controller: ArchiveReaderAccountController;
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
      controllers: [ArchiveReaderAccountController],
    }).compile();

    controller = module.get<ArchiveReaderAccountController>(ArchiveReaderAccountController);
    readersRepository = module.get<jest.Mocked<ReadersRepository>>(ReadersRepository);
  });

  it('should response 409 if reader already archived', async () => {
    // Arrange
    const params: ArchiveReaderAccountParamsDto = {
      id: 1,
    };

    const reader = new Reader({
      id: params.id,
      isArchived: true,
      archivedAt: new Date(),
    });

    readersRepository.getById.mockResolvedValue(reader);

    // Act
    const promise = controller.handle(params);

    // Assert
    await expect(promise).rejects.toThrow(ConflictException);
  });

  it.todo('should response 404 if reader not found');
  it.todo('should response 204 if reader archived successfully');
});
