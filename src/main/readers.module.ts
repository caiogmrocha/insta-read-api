import { Module } from '@nestjs/common';

import { CreateReaderAccountController } from '@/presentation/http/controllers/readers/create-reader-account/create-reader-account.controller';
import { CreateReaderAccountService } from '@/app/services/readers/create-reader-account/create-reader-account.service';
import { AuthenticateReaderService } from '@/app/services/readers/authenticate-reader/authenticate-reader.service';
import { AuthenticateReaderController } from '@/presentation/http/controllers/readers/authenticate-reader/authenticate-reader.controller';
import { UpdateReaderAccountService } from '@/app/services/readers/update-reader-account/update-reader-account.service';
import { UpdateReaderAccountController } from '@/presentation/http/controllers/readers/update-reader-account/update-reader-account.controller';
import { ArchiveReaderAccountService } from '@/app/services/readers/archive-reader-account/archive-reader-account.service';
import { ArchiveReaderAccountController } from '@/presentation/http/controllers/readers/archive-reader-account/archive-reader-account.controller';
import { BcryptProvider } from '@/app/interfaces/hash/bcrypt.provider';
import { ReadersRepository } from '@/app/interfaces/repositories/reader.repository';
import { PrismaReadersRepository } from '@/infra/repositories/prisma/prisma-readers.repository';
import { BcryptProviderImpl } from '@/infra/hash/bcrypt/bcrypt.provider';
import { PrismaProvider } from '@/infra/repositories/prisma/prisma.provider';
import { JwtProvider } from '@/app/interfaces/auth/jwt/jwt.provider';
import { JwtProviderImpl } from '@/infra/auth/jwt/jwt.provider';

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
    {
      provide: JwtProvider,
      useClass: JwtProviderImpl,
    },
    CreateReaderAccountService,
    AuthenticateReaderService,
    UpdateReaderAccountService,
    ArchiveReaderAccountService,
  ],
  controllers: [
    CreateReaderAccountController,
    AuthenticateReaderController,
    UpdateReaderAccountController,
    ArchiveReaderAccountController,
  ],
})
export class ReadersModule {}
