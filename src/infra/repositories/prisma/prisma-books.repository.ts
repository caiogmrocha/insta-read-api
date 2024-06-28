import { BooksRepository } from "@/app/interfaces/repositories/books.repository";
import { Book } from "@/domain/entities/book";
import { Injectable } from "@nestjs/common";
import { PrismaProvider } from "./prisma.provider";

@Injectable()
export class PrismaBooksRepository implements BooksRepository {
  constructor (
    private readonly prisma: PrismaProvider,
  ) {}

  public async getByISBN(isbn: string): Promise<Book | null> {
    const book = await this.prisma.book.findFirst({
      where: {
        isbn,
      },
    });

    if (!book) {
      return null;
    }

    return new Book({
      isbn: book.isbn,
      title: book.title,
      sinopsis: book.sinopsis,
      pages: book.pages,
      author: book.author,
      category: book.category,
      publisher: book.publisher,
      publicationDate: book.publicationDate,
      createdAt: book.createdAt,
      updatedAt: book.updatedAt,
      deletedAt: book.deletedAt,
      deleted: book.deleted,
    });
  }

  public async create(book: Book): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
