import { ReaderNotFoundException } from '@/app/services/readers/errors/reader-not-found.exception';
import { UpdateReaderAccountService } from '@/app/services/readers/update-reader-account/update-reader-account.service';
import { Body, Controller, InternalServerErrorException, NotFoundException, Param, Put } from '@nestjs/common';
import { UpdateReaderAccountBodyDto, UpdateReaderAccountParamsDto } from './update-reader-account.dto';

@Controller()
export class UpdateReaderAccountController {
  constructor (
    private readonly updateReaderAccountService: UpdateReaderAccountService,
  ) {}

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

        default: {
          throw new InternalServerErrorException(error.message);
        };
      }
    }
  }
}
