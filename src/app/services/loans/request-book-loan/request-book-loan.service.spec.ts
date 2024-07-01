import { Test, TestingModule } from '@nestjs/testing';
import { getQueueToken } from '@nestjs/bullmq';

import { faker } from '@faker-js/faker';
import { Queue } from 'bullmq';

import { RequestBookLoanParams, RequestBookLoanService } from './request-book-loan.service';
import { BooksRepository } from '@/app/interfaces/repositories/books.repository';
import { ReadersRepository } from '@/app/interfaces/repositories/reader.repository';
import { ReaderNotFoundException } from '../../readers/errors/reader-not-found.exception';
import { BookNotFoundException } from '../../books/errors/book-not-found.exception';
import { Book } from '@/domain/entities/book';
import { Reader } from '@/domain/entities/reader';
import { BookLoanRequestAlreadyExistsException } from '../errors/book-loan-request-already-exists.exception';

describe('RequestBookLoanService', () => {
  let service: RequestBookLoanService;
  let booksRepository: jest.Mocked<BooksRepository>;
  let readersRepository: jest.Mocked<ReadersRepository>;
  let bookLoanQueueProducer: jest.Mocked<Queue>;

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
        {
          provide: getQueueToken('book-loan'),
          useClass: jest.fn().mockImplementation(() => ({
            add: jest.fn(),
            getJob: jest.fn(),
          })),
        },
        RequestBookLoanService,
      ],
    }).compile();

    service = module.get<RequestBookLoanService>(RequestBookLoanService);
    booksRepository = module.get<jest.Mocked<BooksRepository>>(BooksRepository);
    readersRepository = module.get<jest.Mocked<ReadersRepository>>(ReadersRepository);
    bookLoanQueueProducer = module.get<jest.Mocked<Queue>>(getQueueToken('book-loan'));
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

  it('should throw ReaderNotFoundException when reader is not found', async () => {
    // Arrange
    const params: RequestBookLoanParams = {
      readerId: faker.number.int(),
      bookId: faker.number.int(),
    };

    const book = new Book({
      id: params.bookId,
      title: faker.lorem.words(),
    });

    booksRepository.getById.mockResolvedValue(book);
    readersRepository.getById.mockResolvedValue(null);

    // Act
    const promise = service.execute(params);

    // Assert
    await expect(promise).rejects.toThrow(ReaderNotFoundException);
  });

  it('should throw BookLoanRequestAlreadyExistsException when loan request already exists', async () => {
    // Arrange
    const params: RequestBookLoanParams = {
      readerId: faker.number.int(),
      bookId: faker.number.int(),
    };

    const book = new Book({
      id: params.bookId,
      title: faker.lorem.words(),
    });

    const reader = new Reader({
      id: params.readerId,
      name: faker.person.fullName(),
      archivedAt: null,
      isArchived: false,
    });

    booksRepository.getById.mockResolvedValue(book);
    readersRepository.getById.mockResolvedValue(reader);
    bookLoanQueueProducer.getJob.mockResolvedValue(<any>{});

    // Act
    const promise = service.execute(params);

    // Assert
    await expect(promise).rejects.toThrow(BookLoanRequestAlreadyExistsException);
  });

  it.todo('should throw ReaderNotActiveException when reader is not active'); // This test is not necessary

  it('should enqueue loan request', async () => {
    // Arrange
    const params: RequestBookLoanParams = {
      readerId: faker.number.int(),
      bookId: faker.number.int(),
    };

    const book = new Book({
      id: params.bookId,
      title: faker.lorem.words(),
    });

    const reader = new Reader({
      id: params.readerId,
      name: faker.person.fullName(),
      archivedAt: null,
      isArchived: false,
    });

    booksRepository.getById.mockResolvedValue(book);
    readersRepository.getById.mockResolvedValue(reader);

    // Act
    await service.execute(params);

    // Assert
    expect(bookLoanQueueProducer.add).toHaveBeenCalled();
  });
});
