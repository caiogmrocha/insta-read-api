import { Test, TestingModule } from '@nestjs/testing';
import { UpdateReaderAccountService } from './update-reader-account.service';

describe('UpdateReaderAccountService', () => {
  let service: UpdateReaderAccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpdateReaderAccountService],
    }).compile();

    service = module.get<UpdateReaderAccountService>(UpdateReaderAccountService);
  });

  it.todo('should throw ReaderNotFoundException when reader not found');
  it.todo('should throw ReaderEmailAlreadyExistsException when email already exists');
  it.todo('should update the reader account');
});
