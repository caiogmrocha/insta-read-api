import { Body, ConflictException, Controller, HttpCode, HttpStatus, InternalServerErrorException, NotFoundException, Param, Put, UseGuards } from '@nestjs/common';

import { UpdateReaderAccountBodyDto, UpdateReaderAccountParamsDto } from './update-reader-account.dto';
import { UpdateReaderAccountService } from '@/app/services/readers/update-reader-account/update-reader-account.service';
import { ReaderNotFoundException } from '@/app/services/readers/errors/reader-not-found.exception';
import { ReaderEmailAlreadyExistsException } from '@/app/services/readers/errors/reader-email-already-exists.exception';
import { AuthJwtGuard } from '@/infra/guards/auth-jwt.guard';
import { AuthReaderGuard } from '@/infra/guards/auth-reader.guard';

@Controller()
export class UpdateReaderAccountController {
  constructor (
    private readonly updateReaderAccountService: UpdateReaderAccountService,
  ) {}

  @UseGuards(AuthJwtGuard, AuthReaderGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put('/api/readers/:id')
  public async handle(
    @Param() params: UpdateReaderAccountParamsDto,
    @Body() body: UpdateReaderAccountBodyDto,
  ): Promise<void> {
    try {
      await this.updateReaderAccountService.execute({
        ...params,
        ...body,
      });
    } catch (error) {
      switch (error.constructor) {
        case ReaderNotFoundException: {
          throw new NotFoundException('Reader not found');
        };

        case ReaderEmailAlreadyExistsException: {
          throw new ConflictException(error.message);
        };

        default: {
          throw new InternalServerErrorException(error.message);
        };
      }
    }
  }
}
