import { Test, TestingModule } from '@nestjs/testing';
import { ArchiveReaderAccountController } from './archive-reader-account.controller';
import { ReadersRepository } from '@/app/interfaces/repositories/reader.repository';
import { ArchiveReaderAccountService } from '@/app/services/readers/archive-reader-account/archive-reader-account.service';

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

  it.todo('should response 409 if reader already archived');
  it.todo('should response 404 if reader not found');
  it.todo('should response 204 if reader archived successfully');
});
