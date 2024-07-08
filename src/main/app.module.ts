import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from "@nestjs-modules/ioredis";

import { ReadersModule } from './readers.module';
import { AdminsModule } from './admins.module';
import { BooksModule } from './books.module';
import { LoansModule } from './loans.module';
import { JwtProvider } from '@/app/interfaces/auth/jwt/jwt.provider';
import { JwtProviderImpl } from '@/infra/auth/jwt/jwt.provider';
import { AuthJwtGuard } from '@/infra/guards/auth-jwt.guard';
import { AuthAdminGuard } from '@/infra/guards/auth-admin.guard';
import { AuthReaderGuard } from '@/infra/guards/auth-reader.guard';
import { WebSocketsModule } from './websockets.module';
import { WebSocketsProvider } from '@/presentation/websockets/websockets.provider';

@Module({
  imports: [
    ConfigModule.forRoot(),
    RedisModule.forRoot({
      type: 'single',
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRATION_TIME,
      },
    }),
    WebSocketsModule,
    AdminsModule,
    ReadersModule,
    BooksModule,
    LoansModule,
  ],
  providers: [
    {
      provide: JwtProvider,
      useClass: JwtProviderImpl,
    },
    {
      provide: WebSocketsProvider,
      useValue: WebSocketsProvider.getInstance(),
    },
    AuthJwtGuard,
    AuthAdminGuard,
    AuthReaderGuard,
  ],
})
export class AppModule {}
