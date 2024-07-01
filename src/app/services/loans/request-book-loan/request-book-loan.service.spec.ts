import { Test, TestingModule } from '@nestjs/testing';
import { RequestBookLoanService } from './request-book-loan.service';

describe('RequestBookLoanService', () => {
  let service: RequestBookLoanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RequestBookLoanService],
    }).compile();

    service = module.get<RequestBookLoanService>(RequestBookLoanService);
  });

  it.todo('should throw BookNotFoundException when book is not found');
  it.todo('should throw ReaderNotFoundException when reader is not found');
  it.skip('should throw ReaderNotActiveException when reader is not active'); // This test is not necessary
  it.todo('should enqueue loan request');
});
