import { ReadersRepository } from '@/app/interfaces/repositories/reader.repository';
import { Inject, Injectable } from '@nestjs/common';
import { ReaderNotFoundException } from '../errors/reader-not-found.exception';
import { BcryptProvider } from '@/app/interfaces/hash/bcrypt.provider';
import { InvalidReaderPasswordException } from '../errors/invalid-reader-password.exception';
import { JwtProvider } from '@/app/interfaces/auth/jwt/jwt.provider';

export type AuthenticateReaderServiceParams = {
  email: string;
  password: string;
};

export type AuthenticateReaderServiceResponse = {
  token: string;
};

@Injectable()
export class AuthenticateReaderService {
  constructor (
    @Inject(ReadersRepository) private readonly readersRepository: ReadersRepository,
    @Inject(BcryptProvider) private readonly bcryptProvider: BcryptProvider,
    @Inject(JwtProvider) private readonly jwtProvider: JwtProvider,
  ) {}

  public async execute(params: AuthenticateReaderServiceParams): Promise<AuthenticateReaderServiceResponse> {
    const reader = await this.readersRepository.getByEmail(params.email);

    if (!reader) {
      throw new ReaderNotFoundException('email', params.email);
    }

    const passwordMatch = await this.bcryptProvider.compare(params.password, reader.password);

    if (!passwordMatch) {
      throw new InvalidReaderPasswordException(params.email);
    }

    const token = await this.jwtProvider.sign({ id: reader.id }, process.env.JWT_SECRET);

    return { token };
  }
}
