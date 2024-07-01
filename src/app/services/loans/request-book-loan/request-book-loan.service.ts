import { Inject, Injectable } from '@nestjs/common';

import { BooksRepository } from '@/app/interfaces/repositories/books.repository';
import { ReadersRepository } from '@/app/interfaces/repositories/reader.repository';
import { BookNotFoundException } from '../../books/errors/book-not-found.exception';
import { ReaderNotFoundException } from '../../readers/errors/reader-not-found.exception';

export type RequestBookLoanParams = {
  readerId: number;
  bookId: number;
};

@Injectable()
export class RequestBookLoanService {
  constructor (
    @Inject(BooksRepository) private readonly booksRepository: BooksRepository,
    @Inject(ReadersRepository) private readonly readersRepository: ReadersRepository,
  ) {}

  public async execute(params: RequestBookLoanParams): Promise<void> {
    const book = await this.booksRepository.getById(params.bookId);

    if (!book) {
      throw new BookNotFoundException('id', params.bookId);
    }

    const reader = await this.readersRepository.getById(params.readerId);

    if (!reader) {
      throw new ReaderNotFoundException('id', params.readerId);
    }
  }
}
