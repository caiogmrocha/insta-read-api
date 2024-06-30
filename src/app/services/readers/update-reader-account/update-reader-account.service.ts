import { ReadersRepository } from '@/app/interfaces/repositories/reader.repository';
import { Inject, Injectable } from '@nestjs/common';
import { ReaderNotFoundException } from '../errors/reader-not-found.exception';

export type UpdateReaderAccountServiceParams = {
  id: number;
  name: string;
  email: string;
  password: string;
};

@Injectable()
export class UpdateReaderAccountService {
  constructor (
    @Inject(ReadersRepository) private readonly readersRepository: ReadersRepository,
  ) {}

  public async execute(params: UpdateReaderAccountServiceParams): Promise<void> {
    const reader = await this.readersRepository.getById(params.email);

    if (!reader) {
      throw new ReaderNotFoundException('id', params.id);
    }
  }
}
