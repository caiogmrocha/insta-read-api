import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';

import { Job } from 'bullmq';

import { BooksRepository } from '@/app/interfaces/repositories/books.repository';
import { BookNotFoundException } from '../../books/errors/book-not-found.exception';

export type BookLoanParams = {
  readerId: number;
  bookId: number;
};

@Processor('book-loan')
export class BookLoanProcessor extends WorkerHost {
  constructor (
    @Inject(BooksRepository) private readonly booksRepository: BooksRepository,
  ) { super() }

  public async process(job: Job<BookLoanParams>): Promise<any> {
    const { readerId, bookId } = job.data;

    const book = await this.booksRepository.getById(bookId);

    if (!book) {
      throw new BookNotFoundException('id', bookId);
    }
  }
}
