import { Book } from "@/domain/entities/book";

export interface BooksRepository {
  getByISBN(isbn: string): Promise<Book | null>;
  create(book: Book): Promise<void>;
}

export const BooksRepository = Symbol('BooksRepository');
