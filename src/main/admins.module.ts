import { Module } from '@nestjs/common';

import { AuthenticateAdminService } from '@/app/services/admins/authenticate-admin/authenticate-admin.service';
import { AuthenticateAdminController } from '@/presentation/http/controllers/admins/authenticate-admin/authenticate-admin.controller';
import { JwtProvider } from '@/app/interfaces/auth/jwt/jwt.provider';
import { JwtProviderImpl } from '@/infra/auth/jwt/jwt.provider';
import { BcryptProvider } from '@/app/interfaces/hash/bcrypt.provider';
import { BcryptProviderImpl } from '@/infra/hash/bcrypt/bcrypt.provider';
import { AdminsRepository } from '@/app/interfaces/repositories/admins.repository';
import { PrismaProvider } from '@/infra/repositories/prisma/prisma.provider';
import { PrismaAdminsRepository } from '@/infra/repositories/prisma/prisma-admins.repository';

@Module({
  providers: [
    PrismaProvider,
    {
      provide: BcryptProvider,
      useClass: BcryptProviderImpl,
    },
    {
      provide: AdminsRepository,
      useClass: PrismaAdminsRepository,
    },
    {
      provide: JwtProvider,
      useClass: JwtProviderImpl,
    },
    AuthenticateAdminService,
  ],
  controllers: [
    AuthenticateAdminController,
  ],
})
export class AdminsModule {}
