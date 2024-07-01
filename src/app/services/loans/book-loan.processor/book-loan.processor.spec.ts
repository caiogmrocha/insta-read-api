import { Test, TestingModule } from '@nestjs/testing';
import { BookLoanProcessor } from './book-loan.processor';

describe('BookLoanProcessor', () => {
  let service: BookLoanProcessor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookLoanProcessor],
    }).compile();

    service = module.get<BookLoanProcessor>(BookLoanProcessor);
  });

  it.todo('should throw BookNotFoundException when book is not found');
  it.todo('should throw ReaderNotFoundException when reader is not found');
  it.todo('should throw ReaderAccountDeactivatedException when reader account is deactivated');
  it.todo('should notify reader when book loan request is successful');
});
