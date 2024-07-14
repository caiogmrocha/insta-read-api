import { Module } from '@nestjs/common';

import { CreateBookController } from '@/presentation/http/controllers/books/create-book/create-book.controller';
import { CreateBookService } from '@/app/services/books/create-book/create-book.service';
import { GetPaginatedBooksController } from '@/presentation/http/controllers/books/get-paginated-books/get-paginated-books.controller';
import { GetPaginatedBooksService } from '@/app/services/books/get-paginated-books/get-paginated-books.service';
import { DeleteBookController } from '@/presentation/http/controllers/books/delete-book/delete-book.controller';
import { DeleteBookService } from '@/app/services/books/delete-book/delete-book.service';
import { UpdateBookController } from '@/presentation/http/controllers/books/update-book/update-book.controller';
import { UpdateBookService } from '@/app/services/books/update-book/update-book.service';
import { JwtProvider } from '@/app/interfaces/auth/jwt/jwt.provider';
import { JwtProviderImpl } from '@/infra/auth/jwt/jwt.provider';
import { PrismaProvider } from '@/infra/repositories/prisma/prisma.provider';
import { BooksRepository } from '@/app/interfaces/repositories/books.repository';
import { PrismaBooksRepository } from '@/infra/repositories/prisma/prisma-books.repository';

@Module({
  providers: [
    PrismaProvider,
    {
      provide: BooksRepository,
      useClass: PrismaBooksRepository,
    },
    {
      provide: JwtProvider,
      useClass: JwtProviderImpl,
    },
    CreateBookService,
    UpdateBookService,
    GetPaginatedBooksService,
    DeleteBookService,
  ],
  controllers: [
    CreateBookController,
    UpdateBookController,
    GetPaginatedBooksController,
    DeleteBookController
  ],
})
export class BooksModule {}
