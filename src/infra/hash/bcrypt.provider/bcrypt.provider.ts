import { Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { BcryptProvider } from '@/app/interfaces/hash/bcrypt.provider';

@Injectable()
export class BcryptProviderImpl implements BcryptProvider {
  async hash(value: string): Promise<string> {
    return bcrypt.hash(value, 10);
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return bcrypt.compare(value, hash);
  }
}
