import { Module } from '@nestjs/common';
import { CreateReaderAccountService } from './app/services/readers/create-reader-account/create-reader-account.service';

@Module({
  imports: [],
  controllers: [],
  providers: [CreateReaderAccountService],
})
export class AppModule {}
