import { Test, TestingModule } from '@nestjs/testing';
import { ArchiveReaderAccountService } from './archive-reader-account.service';

describe('ArchiveReaderAccountService', () => {
  let service: ArchiveReaderAccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArchiveReaderAccountService],
    }).compile();

    service = module.get<ArchiveReaderAccountService>(ArchiveReaderAccountService);
  });

  it.todo('should throw ReaderNotFound exception if reader not found');
  it.todo('should throw ReaderAlreadyArchived exception if reader already archived');
  it.todo('should archive reader account');
});
