import { Module } from '@nestjs/common';

import { CreateReaderAccountController } from '@/presentation/http/controllers/readers/create-reader-account/create-reader-account.controller';
import { CreateReaderAccountService } from '@/app/services/readers/create-reader-account/create-reader-account.service';
import { ReadersRepository } from '@/app/interfaces/repositories/reader.repository';
import { PrismaReadersRepository } from '@/infra/repositories/prisma/prisma-readers.repository';
import { BcryptProviderImpl } from '@/infra/hash/bcrypt/bcrypt.provider';
import { PrismaProvider } from '@/infra/repositories/prisma/prisma.provider';
import { BcryptProvider } from '@/app/interfaces/hash/bcrypt.provider';

@Module({
  providers: [
    PrismaProvider,
    {
      provide: BcryptProvider,
      useClass: BcryptProviderImpl,
    },
    {
      provide: ReadersRepository,
      useClass: PrismaReadersRepository,
    },
    CreateReaderAccountService,
  ],
  controllers: [
    CreateReaderAccountController,
  ],
})
export class ReadersModule {}
