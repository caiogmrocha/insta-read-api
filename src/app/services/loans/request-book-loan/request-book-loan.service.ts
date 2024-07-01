import { BooksRepository } from '@/app/interfaces/repositories/books.repository';
import { Inject, Injectable } from '@nestjs/common';
import { BookNotFoundException } from '../../books/errors/book-not-found.exception';

export type RequestBookLoanParams = {
  readerId: number;
  bookId: number;
};

@Injectable()
export class RequestBookLoanService {
  constructor (
    @Inject(BooksRepository) private readonly booksRepository: BooksRepository,
  ) {}

  public async execute(params: RequestBookLoanParams): Promise<void> {
    const book = await this.booksRepository.getById(params.bookId);

    if (!book) {
      throw new BookNotFoundException('id', params.bookId);
    }
  }
}
