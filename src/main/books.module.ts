import { Module } from '@nestjs/common';

import { CreateBookController } from '@/presentation/http/controllers/books/create-book/create-book.controller';
import { GetPaginatedBooksController } from '@/presentation/http/controllers/books/get-paginated-books/get-paginated-books.controller';
import { CreateBookService } from '@/app/services/books/create-book/create-book.service';
import { GetPaginatedBooksService } from '@/app/services/books/get-paginated-books/get-paginated-books.service';
import { PrismaProvider } from '@/infra/repositories/prisma/prisma.provider';
import { JwtProvider } from '@/app/interfaces/auth/jwt/jwt.provider';
import { JwtProviderImpl } from '@/infra/auth/jwt/jwt.provider';
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
    GetPaginatedBooksService,
  ],
  controllers: [
    CreateBookController,
    GetPaginatedBooksController,
  ],
})
export class BooksModule {}
