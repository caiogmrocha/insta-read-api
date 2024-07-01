import { Test, TestingModule } from '@nestjs/testing';
import { RequestBookLoanParams, RequestBookLoanService } from './request-book-loan.service';
import { faker } from '@faker-js/faker';
import { BookNotFoundException } from '../../books/errors/book-not-found.exception';
import { BooksRepository } from '@/app/interfaces/repositories/books.repository';

describe('RequestBookLoanService', () => {
  let service: RequestBookLoanService;
  let booksRepository: jest.Mocked<BooksRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: BooksRepository,
          useClass: jest.fn().mockImplementation(() => ({
            getById: jest.fn(),
          })),
        },
        RequestBookLoanService,
      ],
    }).compile();

    service = module.get<RequestBookLoanService>(RequestBookLoanService);
    booksRepository = module.get(BooksRepository);
  });

  it('should throw BookNotFoundException when book is not found', async () => {
    // Arrange
    const params: RequestBookLoanParams = {
      readerId: faker.number.int(),
      bookId: faker.number.int(),
    };

    booksRepository.getById.mockResolvedValue(null);

    // Act
    const promise = service.execute(params);

    // Assert
    await expect(promise).rejects.toThrow(BookNotFoundException);
  });

  it.todo('should throw ReaderNotFoundException when reader is not found');
  it.todo('should throw ReaderNotActiveException when reader is not active'); // This test is not necessary
  it.todo('should enqueue loan request');
});
