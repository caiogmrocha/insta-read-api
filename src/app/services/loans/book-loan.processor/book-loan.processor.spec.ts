import { Test, TestingModule } from '@nestjs/testing';

import { faker } from '@faker-js/faker';
import { Job } from 'bullmq';

import { BookLoanParams, BookLoanProcessor } from './book-loan.processor';
import { BooksRepository } from '@/app/interfaces/repositories/books.repository';
import { ReadersRepository } from '@/app/interfaces/repositories/reader.repository';
import { BookNotFoundException } from '../../books/errors/book-not-found.exception';
import { ReaderNotFoundException } from '../../readers/errors/reader-not-found.exception';

describe('BookLoanProcessor', () => {
  let service: BookLoanProcessor;
  let booksRepository: jest.Mocked<BooksRepository>;
  let readersRepository: jest.Mocked<ReadersRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: BooksRepository,
          useClass: jest.fn().mockImplementation(() => ({
            getById: jest.fn(),
          })),
        },
        {
          provide: ReadersRepository,
          useClass: jest.fn().mockImplementation(() => ({
            getById: jest.fn(),
          })),
        },
        BookLoanProcessor,
      ],
    }).compile();

    service = module.get<BookLoanProcessor>(BookLoanProcessor);
    booksRepository = module.get<jest.Mocked<BooksRepository>>(BooksRepository);
    readersRepository = module.get<jest.Mocked<ReadersRepository>>(ReadersRepository);
  });

  it('should throw BookNotFoundException when book is not found', async () => {
    // Arrange
    const params = {
      data: {
        readerId: faker.number.int(),
        bookId: faker.number.int(),
      },
    } as Job<BookLoanParams>;

    booksRepository.getById.mockResolvedValue(null);

    // Act
    const promise = service.process(params);

    // Assert
    await expect(promise).rejects.toThrow(BookNotFoundException);
  });

  it('should throw ReaderNotFoundException when reader is not found', async () => {
    // Arrange
    const params = {
      data: {
        readerId: faker.number.int(),
        bookId: faker.number.int(),
      },
    } as Job<BookLoanParams>;

    booksRepository.getById.mockResolvedValue({} as any);
    readersRepository.getById.mockResolvedValue(null);

    // Act
    const promise = service.process(params);

    // Assert
    await expect(promise).rejects.toThrow(ReaderNotFoundException);
  });

  it.todo('should throw ReaderAccountDeactivatedException when reader account is deactivated');
  it.todo('should notify reader when book loan request is successful');
});
