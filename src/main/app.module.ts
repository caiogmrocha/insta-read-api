import { Module } from '@nestjs/common';
import { ReadersModule } from './readers.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ReadersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
