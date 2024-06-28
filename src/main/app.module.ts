import { Module } from '@nestjs/common';
import { ReadersModule } from './readers.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthJwtGuard } from '@/infra/guards/auth-jwt.guard';
import { JwtProvider } from '@/app/interfaces/auth/jwt/jwt.provider';
import { JwtProviderImpl } from '@/infra/auth/jwt/jwt.provider';
import { AdminsModule } from './admins.module';
import { BooksModule } from './books.module';
import { AuthAdminGuard } from '@/infra/guards/auth-admin.guard';
import { AuthReaderGuard } from '@/infra/guards/auth-reader.guard';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRATION_TIME,
      },
    }),
    AdminsModule,
    ReadersModule,
    BooksModule,
  ],
  controllers: [],
  providers: [
    {
      provide: JwtProvider,
      useClass: JwtProviderImpl,
    },
    AuthJwtGuard,
    AuthAdminGuard,
    AuthReaderGuard,
  ],
})
export class AppModule {}
