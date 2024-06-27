import { Body, Controller, NotFoundException, Post } from '@nestjs/common';

import { AuthenticateReaderDto } from './authenticate-reader.dto';
import { AuthenticateReaderService } from '@/app/services/readers/authenticate-reader/authenticate-reader.service';
import { ReaderNotFoundException } from '@/app/services/readers/errors/reader-not-found-exception.error';

type AuthenticateReaderControllerResponse = {
  token: string;
};

@Controller()
export class AuthenticateReaderController {
  constructor(
    private readonly authenticateReaderService: AuthenticateReaderService
  ) {}

  @Post('/api/readers/login')
  public async handle(@Body() requestDto: AuthenticateReaderDto): Promise<AuthenticateReaderControllerResponse> {
    try {
      const response = await this.authenticateReaderService.execute({
        email: requestDto.email,
        password: requestDto.password,
      });

      return response;
    } catch (error) {
      switch (error.constructor) {
        case ReaderNotFoundException: {
          throw new NotFoundException(error.message);
        };
      }
    }
  }
}
