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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
