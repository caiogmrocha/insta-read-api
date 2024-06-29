import { BooksRepository } from '@/app/interfaces/repositories/books.repository';
import { Inject, Injectable } from '@nestjs/common';
import { BookNotFoundException } from '../errors/book-not-found.exception';

export type UpdateBookServiceParams = {
  id: number;
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
export class UpdateBookService {
  constructor (
    @Inject(BooksRepository) private readonly booksRepository: BooksRepository,
  ) {}

  public async execute(params: UpdateBookServiceParams): Promise<void> {
    const book = await this.booksRepository.getById(params.id);

    if (!book) {
      throw new BookNotFoundException('id', params.id);
    }
  }
}
