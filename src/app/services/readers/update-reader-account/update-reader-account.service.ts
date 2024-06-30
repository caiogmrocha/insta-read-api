import { ReadersRepository } from '@/app/interfaces/repositories/reader.repository';
import { Inject, Injectable } from '@nestjs/common';
import { ReaderNotFoundException } from '../errors/reader-not-found.exception';
import { ReaderEmailAlreadyExistsException } from '../errors/reader-email-already-exists.exception';

export type UpdateReaderAccountServiceParams = Partial<{
  id: number;
  name: string;
  email: string;
  password: string;
}>;

@Injectable()
export class UpdateReaderAccountService {
  constructor (
    @Inject(ReadersRepository) private readonly readersRepository: ReadersRepository,
  ) {}

  public async execute(params: UpdateReaderAccountServiceParams): Promise<void> {
    const reader = await this.readersRepository.getById(params.id);

    if (!reader) {
      throw new ReaderNotFoundException('id', params.id);
    }

    if (reader.email !== params.email) {
      const readerWithEmail = await this.readersRepository.getByEmail(params.email);

      if (readerWithEmail) {
        throw new ReaderEmailAlreadyExistsException(params.email);
      }
    }

    Object.assign(reader, params);

    await this.readersRepository.update(reader);
  }
}
