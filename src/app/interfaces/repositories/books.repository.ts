import { Book } from "@/domain/entities/book";

export interface BooksRepository {
  getById(id: number): Promise<Book | null>;

  getByISBN(isbn: string): Promise<Book | null>;

  getPaginated(params: {
    page: number;
    limit: number;
    fields?: Array<keyof Book>;
  }): Promise<{
    data: any[];
    total: number;
  }>;

  create(book: Book): Promise<void>;
  update(book: Book): Promise<void>;
  delete(id: number): Promise<void>;
}

export const BooksRepository = Symbol('BooksRepository');
