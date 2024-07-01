import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { getQueueToken } from '@nestjs/bullmq';

import { faker } from '@faker-js/faker';
import { Queue } from 'bullmq';

import { RequestBookLoanController } from './request-book-loan.controller';
import { BooksRepository } from '@/app/interfaces/repositories/books.repository';
import { ReadersRepository } from '@/app/interfaces/repositories/reader.repository';
import { RequestBookLoanService } from '@/app/services/loans/request-book-loan/request-book-loan.service';
import { Book } from '@/domain/entities/book';
import { Reader } from '@/domain/entities/reader';

describe('RequestBookLoanController', () => {
  let controller: RequestBookLoanController;
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
      controllers: [RequestBookLoanController],
    }).compile();

    controller = module.get<RequestBookLoanController>(RequestBookLoanController);
    booksRepository = module.get<jest.Mocked<BooksRepository>>(BooksRepository);
    readersRepository = module.get<jest.Mocked<ReadersRepository>>(ReadersRepository);
    bookLoanQueueProducer = module.get<jest.Mocked<Queue>>(getQueueToken('book-loan'));
  });

  it('should response with 404 status code when book is not found', async () => {
    // Arrange
    const body = {
      readerId: faker.number.int(),
      bookId: faker.number.int(),
    };

    booksRepository.getById.mockResolvedValue(null);

    // Act
    const promise = controller.handle(body);

    // Assert
    await expect(promise).rejects.toThrow(NotFoundException);
  });

  it('should response with 404 status code when reader is not found', async () => {
    // Arrange
    const body = {
      readerId: faker.number.int(),
      bookId: faker.number.int(),
    };

    const book = new Book({
      id: faker.number.int(),
      title: faker.lorem.words(),
    });

    booksRepository.getById.mockResolvedValue(book);
    readersRepository.getById.mockResolvedValue(null);

    // Act
    const promise = controller.handle(body);

    // Assert
    await expect(promise).rejects.toThrow(NotFoundException);
  });

  it('should response with 409 status code when book loan request already exists', async () => {
    // Arrange
    const body = {
      readerId: faker.number.int(),
      bookId: faker.number.int(),
    };

    const book = new Book({
      id: faker.number.int(),
      title: faker.lorem.words(),
    });

    const reader = new Reader({
      id: faker.number.int(),
      name: faker.person.fullName(),
    });

    booksRepository.getById.mockResolvedValue(book);
    readersRepository.getById.mockResolvedValue(reader);
    bookLoanQueueProducer.getJob.mockResolvedValue(<any>{});

    // Act
    const promise = controller.handle(body);

    // Assert
    await expect(promise).rejects.toThrow(ConflictException);
  });

  it.todo('should response with 201 status code when request book loan is successful');
});
