import { ReadersRepository } from '@/app/interfaces/repositories/reader.repository';
import { Inject, Injectable } from '@nestjs/common';
import { ReaderNotFoundException } from '../errors/reader-not-found-exception.error';

@Injectable()
export class AuthenticateReaderService {
  constructor (
    @Inject(ReadersRepository) private readonly readersRepository: ReadersRepository,
  ) {}

  public async execute(params: { email: string; password: string }): Promise<void> {
    const reader = await this.readersRepository.getByEmail(params.email);

    if (!reader) {
      throw new ReaderNotFoundException('email', params.email);
    }
  }
}
