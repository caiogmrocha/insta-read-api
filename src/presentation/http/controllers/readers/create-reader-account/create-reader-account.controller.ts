import { Body, ConflictException, Controller, Get, InternalServerErrorException, Post, UseGuards } from '@nestjs/common';

import { CreateReaderAccountDto } from './create-reader-account.dto';
import { CreateReaderAccountService } from '@/app/services/readers/create-reader-account/create-reader-account.service';
import { ReaderEmailAlreadyExistsException } from '@/app/services/readers/errors/reader-email-already-exists.exception';
import { AuthJwtGuard } from '@/infra/guards/auth-jwt.guard';
import { AuthReaderGuard } from '@/infra/guards/auth-reader.guard';
import { AuthAdminGuard } from '@/infra/guards/auth-admin.guard';

@Controller()
export class CreateReaderAccountController {
  constructor (
    private readonly createReaderAccountService: CreateReaderAccountService
  ) {}

  @Post('/api/readers')
  public async handle(@Body() requestDto: CreateReaderAccountDto): Promise<void> {
    try {
      await this.createReaderAccountService.execute({
        name: requestDto.name,
        email: requestDto.email,
        password: requestDto.password,
      });
    } catch (error) {
      switch (error.constructor) {
        case ReaderEmailAlreadyExistsException: {
          throw new ConflictException(error.message);
        };

        default: {
          throw new InternalServerErrorException(error);
        }
      }
    }
  }
}
