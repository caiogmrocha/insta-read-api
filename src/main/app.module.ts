import { Module } from '@nestjs/common';
import { ReadersModule } from './readers.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthJwtGuard } from '@/infra/guards/auth-jwt.guard';
import { JwtProvider } from '@/app/interfaces/auth/jwt/jwt.provider';
import { JwtProviderImpl } from '@/infra/auth/jwt/jwt.provider';
import { AdminsModule } from './admins.module';

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
    ReadersModule,
    AdminsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: JwtProvider,
      useClass: JwtProviderImpl,
    },
    AuthJwtGuard,
  ],
})
export class AppModule {}
