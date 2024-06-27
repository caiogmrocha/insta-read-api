import { Module } from '@nestjs/common';
import { ReadersModule } from './readers.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
