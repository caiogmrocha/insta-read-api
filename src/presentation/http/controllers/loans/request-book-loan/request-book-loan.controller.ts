import { Body, ConflictException, Controller, HttpCode, HttpStatus, InternalServerErrorException, NotFoundException, Post } from '@nestjs/common';

import { RequestBookLoanBodyDto } from './request-book-loan.dto';
import { RequestBookLoanService } from '@/app/services/loans/request-book-loan/request-book-loan.service';
import { BookNotFoundException } from '@/app/services/books/errors/book-not-found.exception';
import { ReaderNotFoundException } from '@/app/services/readers/errors/reader-not-found.exception';
import { BookLoanRequestAlreadyExistsException } from '@/app/services/loans/errors/book-loan-request-already-exists.exception';

@Controller()
export class RequestBookLoanController {
  constructor (
    private readonly requestBookLoanService: RequestBookLoanService,
  ) {}

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('/api/loans/request-book-loan')
  public async handle(@Body() body: RequestBookLoanBodyDto): Promise<void> {
    try {
      await this.requestBookLoanService.execute(body);
    } catch (error) {
      switch (error.constructor) {
        case BookNotFoundException:
        case ReaderNotFoundException: {
          throw new NotFoundException(error.message);
        };

        case BookLoanRequestAlreadyExistsException: {
          throw new ConflictException(error.message);
        };

        default: {
          throw new InternalServerErrorException();
        };
      }
    }
  }
}
