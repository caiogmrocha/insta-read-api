import { Inject, Injectable } from '@nestjs/common';

import { AdminsRepository } from '@/app/interfaces/repositories/admins.repository';
import { AdminNotFoundException } from '../errors/admin-not-found.exception';

type AutheticateAdminServiceParams = {
  email: string;
  password: string;
};

@Injectable()
export class AutheticateAdminService {
  constructor (
    @Inject(AdminsRepository) private readonly adminsRepository: AdminsRepository
  ) {}

  public async execute(params: AutheticateAdminServiceParams): Promise<any> {
    const admin = await this.adminsRepository.getByEmail(params.email);

    if (!admin) {
      throw new AdminNotFoundException('email', params.email);
    }
  }
}
