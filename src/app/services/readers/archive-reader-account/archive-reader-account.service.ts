import { ReadersRepository } from '@/app/interfaces/repositories/reader.repository';
import { Inject, Injectable } from '@nestjs/common';
import { ReaderNotFoundException } from '../errors/reader-not-found.exception';
import { ReaderAlreadyArchivedException } from '../errors/reader-already-archived.exception';

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

    if (reader.isArchived) {
      throw new ReaderAlreadyArchivedException(params.id);
    }
  }
}
