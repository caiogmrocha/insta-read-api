import { Module } from '@nestjs/common';
import { CreateReaderAccountService } from '../app/services/readers/create-reader-account/create-reader-account.service';
import { CreateReaderAccountController } from '../presentation/http/controllers/readers/create-reader-account/create-reader-account.controller';
import { ReaderModule } from './reader.module';

@Module({
  imports: [ReaderModule],
  controllers: [],
  providers: [],
})
export class AppModule {}