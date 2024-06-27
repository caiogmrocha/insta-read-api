import { Inject, Injectable } from '@nestjs/common';

import { Reader } from '@/domain/entities/reader';
import { ReadersRepository } from '@/app/interfaces/repositories/reader.repository';
import { BcryptProvider } from '@/app/interfaces/hash/bcrypt.provider';
import { ReaderEmailAlreadyExistsException } from '@/app/services/readers/errors/reader-email-already-exists.error';

const PASSWORD_HASH_SALT_ROUNDS = 10;

type CreateReaderAccountServiceParams = {
  name: string;
  email: string;
  password: string;
};

@Injectable()
export class CreateReaderAccountService {
  constructor (
    @Inject(ReadersRepository) private readonly readerRepository: ReadersRepository,
    @Inject(BcryptProvider) private readonly bcryptProvider: BcryptProvider
  ) {}

  public async execute(params: CreateReaderAccountServiceParams): Promise<void> {
    const reader = await this.readerRepository.getByEmail(params.email);

    if (reader) {
      throw new ReaderEmailAlreadyExistsException(params.email);
    }

    const passwordHash = await this.bcryptProvider.hash(params.password, PASSWORD_HASH_SALT_ROUNDS);

    await this.readerRepository.create(new Reader({
      name: params.name,
      email: params.email,
      password: passwordHash,
    }));
  }
}
