import { ReadersRepository } from '@/app/interfaces/repositories/reader.repository';
import { Inject, Injectable } from '@nestjs/common';
import { ReaderNotFoundException } from '../errors/reader-not-found-exception.error';
import { BcryptProvider } from '@/app/interfaces/hash/bcrypt.provider';
import { InvalidReaderPasswordException } from '../errors/invalid-reader-password-exception.error';

@Injectable()
export class AuthenticateReaderService {
  constructor (
    @Inject(ReadersRepository) private readonly readersRepository: ReadersRepository,
    @Inject(BcryptProvider) private readonly bcryptProvider: BcryptProvider,
  ) {}

  public async execute(params: { email: string; password: string }): Promise<void> {
    const reader = await this.readersRepository.getByEmail(params.email);

    if (!reader) {
      throw new ReaderNotFoundException('email', params.email);
    }

    const passwordMatch = await this.bcryptProvider.compare(params.password, reader.password);

    if (!passwordMatch) {
      throw new InvalidReaderPasswordException(params.email);
    }
  }
}
