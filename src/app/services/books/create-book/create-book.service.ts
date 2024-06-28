import { Inject, Injectable } from '@nestjs/common';

import { Book } from '@/domain/entities/book';
import { BooksRepository } from '@/app/interfaces/repositories/books.repository';
import { BookISBNAlreadyExistsException } from './errors/book-isbn-already-exists.exception';

type CreateBookServiceParams = {
  isbn: string;
  title: string;
  sinopsis: string;
  pages: number;
  amount: number;
  author: string;
  category: string;
  publisher: string;
  publicationDate: Date;
};

@Injectable()
export class CreateBookService {
  constructor (
    @Inject(BooksRepository) private readonly booksRepository: BooksRepository,
  ) {}

  public async execute(params: CreateBookServiceParams): Promise<void> {
    const book = await this.booksRepository.getByISBN(params.isbn);

    if (book) {
      throw new BookISBNAlreadyExistsException(params.isbn);
    }

    await this.booksRepository.create(new Book(params));
  }
}
