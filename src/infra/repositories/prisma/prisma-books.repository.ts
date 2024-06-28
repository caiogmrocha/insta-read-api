import { BooksRepository } from "@/app/interfaces/repositories/books.repository";
import { Book } from "@/domain/entities/book";
import { Injectable } from "@nestjs/common";
import { PrismaProvider } from "./prisma.provider";

@Injectable()
export class PrismaBooksRepository implements BooksRepository {
  constructor (
    private readonly prisma: PrismaProvider,
  ) {}

  public async getById(id: number): Promise<Book | null> {
    const book = await this.prisma.book.findFirst({
      where: {
        id,
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
      amount: book.amount,
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
      amount: book.amount,
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

  public async getPaginated(params: { page: number; limit: number; fields?: (keyof Book)[]; }): Promise<{ data: any[]; total: number; }> {
    const books = await this.prisma.book.findMany({
      skip: (params.page - 1) * params.limit,
      take: params.limit,
      select: (params.fields && params.fields.length)
        ? params.fields.reduce((acc, field) => {
          acc[field] = true;
          return acc;
        }, {})
        : undefined,
    });

    const total = await this.prisma.book.count();

    return {
      data: books,
      total,
    };
  }

  public async create(book: Book): Promise<void> {
    await this.prisma.book.create({
      data: {
        isbn: book.isbn,
        title: book.title,
        sinopsis: book.sinopsis,
        pages: book.pages,
        amount: book.amount,
        author: book.author,
        category: book.category,
        publisher: book.publisher,
        publicationDate: book.publicationDate,
      },
    });
  }

  public async delete(id: number): Promise<void> {
    await this.prisma.book.delete({
      where: {
        id,
      },
    });
  }
}
