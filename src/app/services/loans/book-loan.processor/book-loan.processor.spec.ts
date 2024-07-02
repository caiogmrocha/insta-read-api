import { Test, TestingModule } from '@nestjs/testing';

import { faker } from '@faker-js/faker';
import { Job } from 'bullmq';

import { BookLoanParams, BookLoanProcessor } from './book-loan.processor';
import { BooksRepository } from '@/app/interfaces/repositories/books.repository';
import { ReadersRepository } from '@/app/interfaces/repositories/reader.repository';
import { WebSocketProvider } from '@/app/interfaces/websockets/websocket-server.provider';
import { BookNotFoundException } from '../../books/errors/book-not-found.exception';
import { ReaderNotFoundException } from '../../readers/errors/reader-not-found.exception';
import { ReaderAccountDeactivatedException } from '../../readers/errors/reader-account-deactivated.exception';
import { Reader } from '@/domain/entities/reader';
import { Book } from '@/domain/entities/book';

describe('BookLoanProcessor', () => {
  let service: BookLoanProcessor;
  let booksRepository: jest.Mocked<BooksRepository>;
  let readersRepository: jest.Mocked<ReadersRepository>;
  let webSocketProvider: jest.Mocked<WebSocketProvider>;

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
          provide: WebSocketProvider,
          useValue: {
            emit: jest.fn(),
          },
        },
        BookLoanProcessor,
      ],
    }).compile();

    service = module.get<BookLoanProcessor>(BookLoanProcessor);
    booksRepository = module.get<jest.Mocked<BooksRepository>>(BooksRepository);
    readersRepository = module.get<jest.Mocked<ReadersRepository>>(ReadersRepository);
    webSocketProvider = module.get<jest.Mocked<WebSocketProvider>>(WebSocketProvider);
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

  it('should throw ReaderAccountDeactivatedException when reader account is deactivated', async () => {
    // Arrange
    const params = {
      data: {
        readerId: faker.number.int(),
        bookId: faker.number.int(),
      },
    } as Job<BookLoanParams>;

    booksRepository.getById.mockResolvedValue({} as any);

    const reader = new Reader({
      id: params.data.readerId,
      name: faker.person.fullName(),
      email: faker.internet.email(),
      isArchived: true,
    });

    readersRepository.getById.mockResolvedValue(reader);

    // Act
    const promise = service.process(params);

    // Assert
    await expect(promise).rejects.toThrow(ReaderAccountDeactivatedException);
  });

  it('should notify reader when book loan request is successful', async () => {
    // Arrange
    const params = {
      data: {
        readerId: faker.number.int(),
        bookId: faker.number.int(),
      },
    } as Job<BookLoanParams>;

    const book = new Book({
      id: params.data.bookId,
      title: faker.lorem.words(),
    });

    booksRepository.getById.mockResolvedValue(book);

    const reader = new Reader({
      id: params.data.readerId,
      name: faker.person.fullName(),
      email: faker.internet.email(),
      isArchived: false,
    });

    readersRepository.getById.mockResolvedValue(reader);

    // Act
    const promise = service.process(params);

    // Assert
    await expect(promise).resolves.not.toThrow();
    expect(webSocketProvider.emit).toHaveBeenCalledWith('notify', reader.id, {
      type: 'book-loan',
      data: {
        bookId: book.id,
        bookTitle: book.title,
      },
    });
  });
});
