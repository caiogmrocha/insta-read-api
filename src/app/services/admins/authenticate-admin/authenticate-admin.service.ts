import { Inject, Injectable } from '@nestjs/common';

import { AdminsRepository } from '@/app/interfaces/repositories/admins.repository';
import { BcryptProvider } from '@/app/interfaces/hash/bcrypt.provider';
import { JwtProvider } from '@/app/interfaces/auth/jwt/jwt.provider';
import { AdminNotFoundException } from '../errors/admin-not-found.exception';
import { InvalidAdminPasswordException } from '../errors/invalid-admin-password.exception';

type AutheticateAdminServiceParams = {
  email: string;
  password: string;
};

type AutheticateAdminServiceResponse = {
  token: string;
};

@Injectable()
export class AuthenticateAdminService {
  constructor (
    @Inject(AdminsRepository) private readonly adminsRepository: AdminsRepository,
    @Inject(BcryptProvider) private readonly bcryptProvider: BcryptProvider,
    @Inject(JwtProvider) private readonly jwtProvider: JwtProvider,
  ) {}

  public async execute(params: AutheticateAdminServiceParams): Promise<AutheticateAdminServiceResponse> {
    const admin = await this.adminsRepository.getByEmail(params.email);

    if (!admin) {
      throw new AdminNotFoundException('email', params.email);
    }

    const passwordMatch = await this.bcryptProvider.compare(params.password, admin.password);

    if (!passwordMatch) {
      throw new InvalidAdminPasswordException(params.email);
    }

    const { ...payload } = admin;

    const token = await this.jwtProvider.sign(payload, process.env.JWT_SECRET);

    return { token };
  }
}
