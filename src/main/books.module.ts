import { JwtProvider } from '@/app/interfaces/auth/jwt/jwt.provider';
import { BooksRepository } from '@/app/interfaces/repositories/books.repository';
import { CreateBookService } from '@/app/services/books/create-book/create-book.service';
import { JwtProviderImpl } from '@/infra/auth/jwt/jwt.provider';
import { PrismaBooksRepository } from '@/infra/repositories/prisma/prisma-books.repository';
import { PrismaProvider } from '@/infra/repositories/prisma/prisma.provider';
import { CreateBookController } from '@/presentation/http/controllers/books/create-book/create-book.controller';
import { Module } from '@nestjs/common';

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
  ],
  controllers: [
    CreateBookController,
  ],
})
export class BooksModule {}
