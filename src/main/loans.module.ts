import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';

import { RequestBookLoanService } from '@/app/services/loans/request-book-loan/request-book-loan.service';
import { RequestBookLoanController } from '@/presentation/http/controllers/loans/request-book-loan/request-book-loan.controller';
import { JwtProvider } from '@/app/interfaces/auth/jwt/jwt.provider';
import { JwtProviderImpl } from '@/infra/auth/jwt/jwt.provider';
import { BooksRepository } from '@/app/interfaces/repositories/books.repository';
import { PrismaBooksRepository } from '@/infra/repositories/prisma/prisma-books.repository';
import { ReadersRepository } from '@/app/interfaces/repositories/reader.repository';
import { PrismaReadersRepository } from '@/infra/repositories/prisma/prisma-readers.repository';
import { PrismaProvider } from '@/infra/repositories/prisma/prisma.provider';
import { AuthJwtGuard } from '@/infra/guards/auth-jwt.guard';
import { AuthReaderGuard } from '@/infra/guards/auth-reader.guard';
import { BookLoanProcessor } from '@/app/services/loans/book-loan.processor/book-loan.processor';
import { WebSocketsProvider } from '@/presentation/websockets/websockets.provider';

@Module({
  imports: [
    ConfigModule.forRoot(),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
      },
    }),
    BullModule.registerQueue({
      name: 'book-loan',
    }),
  ],
  providers: [
    {
      provide: JwtProvider,
      useClass: JwtProviderImpl,
    },
    AuthJwtGuard,
    AuthReaderGuard,
    PrismaProvider,
    {
      provide: WebSocketsProvider,
      useValue: WebSocketsProvider.getInstance(),
    },
    {
      provide: BooksRepository,
      useClass: PrismaBooksRepository,
    },
    {
      provide: ReadersRepository,
      useClass: PrismaReadersRepository,
    },
    RequestBookLoanService,
    BookLoanProcessor,
  ],
  controllers: [
    RequestBookLoanController,
  ],
})
export class LoansModule {}
