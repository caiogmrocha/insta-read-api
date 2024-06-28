import { Inject, Injectable } from '@nestjs/common';

import { BooksRepository } from '@/app/interfaces/repositories/books.repository';
import { BookNotFoundException } from '../errors/book-not-found.exception';

export type DeleteBookServiceParams = {
  id: number;
};

@Injectable()
export class DeleteBookService {
  constructor (
    @Inject(BooksRepository) private readonly booksRepository: BooksRepository
  ) {}

  public async execute (params: DeleteBookServiceParams): Promise<void> {
    const book = await this.booksRepository.getById(params.id);

    if (!book) {
      throw new BookNotFoundException('id', params.id);
    }

    await this.booksRepository.delete(params.id);
  }
}