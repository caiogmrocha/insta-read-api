import { Test, TestingModule } from '@nestjs/testing';
import { CreateReaderAccountService } from './create-reader-account.service';

describe('CreateReaderAccountService', () => {
  let service: CreateReaderAccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateReaderAccountService],
    }).compile();

    service = module.get<CreateReaderAccountService>(CreateReaderAccountService);
  });

  it.todo('should create a new reader account');
  it.todo('should throw ReaderEmailAlreadyExistsException when email already exists');
});
