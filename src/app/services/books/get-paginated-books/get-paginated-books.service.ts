import { Inject, Injectable } from '@nestjs/common';

import { BooksRepository } from '@/app/interfaces/repositories/books.repository';
import { Book } from '@/domain/entities/book';

export type GetPaginatedBooksServiceParams = {
  page: number;
  limit: number;
  fields?: Array<keyof Book>;
};

export type GetPaginatedBooksServiceResponse = {
  data: any[];
  total: number;
};

@Injectable()
export class GetPaginatedBooksService {
  constructor (
    @Inject(BooksRepository) private readonly booksRepository: BooksRepository
  ) {}

  public async execute(params: GetPaginatedBooksServiceParams) {
    const books = await this.booksRepository.getPaginated(params);

    return books;
  }
}
