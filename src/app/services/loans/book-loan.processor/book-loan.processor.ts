import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';

import { Job } from 'bullmq';

import { BooksRepository } from '@/app/interfaces/repositories/books.repository';
import { ReadersRepository } from '@/app/interfaces/repositories/reader.repository';
import { BookNotFoundException } from '../../books/errors/book-not-found.exception';
import { ReaderNotFoundException } from '../../readers/errors/reader-not-found.exception';
import { ReaderAccountDeactivatedException } from '../../readers/errors/reader-account-deactivated.exception';
import { WebSocketProvider } from '@/app/interfaces/websockets/websocket-server.provider';

export type BookLoanParams = {
  readerId: number;
  bookId: number;
};

@Processor('book-loan')
export class BookLoanProcessor extends WorkerHost {
  constructor (
    @Inject(BooksRepository) private readonly booksRepository: BooksRepository,
    @Inject(ReadersRepository) private readonly readersRepository: ReadersRepository,
    @Inject(WebSocketProvider) private readonly webSocketProvider: WebSocketProvider,
  ) { super() }

  public async process(job: Job<BookLoanParams>): Promise<any> {
    const { readerId, bookId } = job.data;

    const book = await this.booksRepository.getById(bookId);

    if (!book) {
      throw new BookNotFoundException('id', bookId);
    }

    const reader = await this.readersRepository.getById(readerId);

    if (!reader) {
      throw new ReaderNotFoundException('id', readerId);
    }

    if (reader.isArchived) {
      throw new ReaderAccountDeactivatedException('id', reader.id);
    }

    this.webSocketProvider.emit('notify', reader.id, {
      type: 'book-loan',
      data: {
        bookId: book.id,
        bookTitle: book.title,
      },
    });
  }
}
