import { Inject, Injectable } from '@nestjs/common';
import { ReaderRepository } from '../../interfaces/repositories/reader-repository';
import { ReaderEmailAlreadyExistsException } from '../errors/reader-email-already-exists.error';

type CreateReaderAccountServiceParams = {
  name: string;
  email: string;
  password: string;
};

@Injectable()
export class CreateReaderAccountService {
  constructor (
    @Inject(ReaderRepository) private readonly readerRepository: ReaderRepository,
  ) {}

  public async execute(params: CreateReaderAccountServiceParams): Promise<void> {
    const reader = await this.readerRepository.getByEmail(params.email);

    if (reader) {
      throw new ReaderEmailAlreadyExistsException(params.email);
    }
  }
}
