import { ConflictException, Controller, HttpCode, InternalServerErrorException, NotFoundException, Param, Patch } from '@nestjs/common';

import { ArchiveReaderAccountParamsDto } from './archive-reader-account.dto';
import { ArchiveReaderAccountService } from '@/app/services/readers/archive-reader-account/archive-reader-account.service';
import { ReaderAlreadyArchivedException } from '@/app/services/readers/errors/reader-already-archived.exception';
import { ReaderNotFoundException } from '@/app/services/readers/errors/reader-not-found.exception';

@Controller()
export class ArchiveReaderAccountController {
  constructor (
    private readonly archiveReaderAccountService: ArchiveReaderAccountService,
  ) {}

  @HttpCode(204)
  @Patch('/api/readers/:id/archive')
  public async handle(@Param() params: ArchiveReaderAccountParamsDto): Promise<void> {
    try {
      await this.archiveReaderAccountService.execute(params);
    } catch (error) {
      switch (error.constructor) {
        case ReaderNotFoundException: {
          throw new NotFoundException(error.message);
        };

        case ReaderAlreadyArchivedException: {
          throw new ConflictException(error.message);
        };

        default: {
          throw new InternalServerErrorException(error.message);
        };
      }
    }
  }
}
