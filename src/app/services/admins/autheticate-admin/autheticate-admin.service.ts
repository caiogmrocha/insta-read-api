import { Inject, Injectable } from '@nestjs/common';

import { AdminsRepository } from '@/app/interfaces/repositories/admins.repository';
import { AdminNotFoundException } from '../errors/admin-not-found.exception';
import { BcryptProvider } from '@/app/interfaces/hash/bcrypt.provider';
import { InvalidAdminPasswordException } from '../errors/invalid-admin-password.exception';

type AutheticateAdminServiceParams = {
  email: string;
  password: string;
};

@Injectable()
export class AutheticateAdminService {
  constructor (
    @Inject(AdminsRepository) private readonly adminsRepository: AdminsRepository,
    @Inject(BcryptProvider) private readonly bcryptProvider: BcryptProvider,
  ) {}

  public async execute(params: AutheticateAdminServiceParams): Promise<any> {
    const admin = await this.adminsRepository.getByEmail(params.email);

    if (!admin) {
      throw new AdminNotFoundException('email', params.email);
    }

    const passwordMatch = await this.bcryptProvider.compare(params.password, admin.password);

    if (!passwordMatch) {
      throw new InvalidAdminPasswordException(params.email);
    }
  }
}
