import { JwtProvider } from '@/app/interfaces/auth/jwt/jwt.provider';
import { BcryptProvider } from '@/app/interfaces/hash/bcrypt.provider';
import { AdminsRepository } from '@/app/interfaces/repositories/admins.repository';
import { AuthenticateAdminService } from '@/app/services/admins/authenticate-admin/authenticate-admin.service';
import { JwtProviderImpl } from '@/infra/auth/jwt/jwt.provider';
import { BcryptProviderImpl } from '@/infra/hash/bcrypt/bcrypt.provider';
import { PrismaAdminsRepository } from '@/infra/repositories/prisma/prisma-admins.repository';
import { PrismaProvider } from '@/infra/repositories/prisma/prisma.provider';
import { AuthenticateAdminController } from '@/presentation/http/controllers/admins/authenticate-admin/authenticate-admin.controller';
import { Module } from '@nestjs/common';

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
