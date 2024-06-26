import { BcryptProvider } from '@/app/interfaces/hash/bcrypt.provider';
import { CreateReaderAccountService } from '@/app/services/readers/create-reader-account/create-reader-account.service';
import { BcryptProviderImpl } from '@/infra/hash/bcrypt.provider/bcrypt.provider';
import { CreateReaderAccountController } from '@/presentation/http/controllers/readers/create-reader-account/create-reader-account.controller';
import { Module } from '@nestjs/common';

@Module({
  providers: [
    {
      provide: BcryptProvider,
      useClass: BcryptProviderImpl,
    },
    CreateReaderAccountService,
  ],
  controllers: [
    CreateReaderAccountController,
  ],
  imports: [],
})
export class ReaderModule {}
