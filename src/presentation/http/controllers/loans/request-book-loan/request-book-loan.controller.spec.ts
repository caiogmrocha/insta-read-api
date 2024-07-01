import { Test, TestingModule } from '@nestjs/testing';
import { RequestBookLoanController } from './request-book-loan.controller';
import { BooksRepository } from '@/app/interfaces/repositories/books.repository';
import { ReadersRepository } from '@/app/interfaces/repositories/reader.repository';
import { Queue } from 'bullmq';
import { getQueueToken } from '@nestjs/bullmq';
import { RequestBookLoanService } from '@/app/services/loans/request-book-loan/request-book-loan.service';
import { NotFoundException } from '@nestjs/common';

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
      readerId: 1,
      bookId: 1,
    };

    booksRepository.getById.mockResolvedValue(null);

    // Act
    const promise = controller.handle(body);

    // Assert
    await expect(promise).rejects.toThrow(NotFoundException);
  });

  it.todo('should response with 404 status code when reader is not found');
  it.todo('should response with 409 status code when book loan request already exists');
  it.todo('should response with 201 status code when request book loan is successful');
});
