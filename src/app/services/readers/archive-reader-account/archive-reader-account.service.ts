import { Inject, Injectable } from '@nestjs/common';

import { ReadersRepository } from '@/app/interfaces/repositories/reader.repository';
import { ReaderNotFoundException } from '../errors/reader-not-found.exception';

export type ArchiveReaderAccountServiceParams = {
  id: number;
};

@Injectable()
export class ArchiveReaderAccountService {
  constructor (
    @Inject(ReadersRepository) private readonly readersRepository: ReadersRepository,
  ) {}

  public async execute(params: ArchiveReaderAccountServiceParams): Promise<void> {
    const reader = await this.readersRepository.getById(params.id);

    if (!reader) {
      throw new ReaderNotFoundException('id', params.id);
    }

    reader.archive();

    await this.readersRepository.update(reader);
  }
}
