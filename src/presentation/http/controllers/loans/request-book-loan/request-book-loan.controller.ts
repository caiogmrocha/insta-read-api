import { Body, Controller, HttpCode, HttpStatus, InternalServerErrorException, NotFoundException, Post } from '@nestjs/common';

import { RequestBookLoanBodyDto } from './request-book-loan.dto';
import { RequestBookLoanService } from '@/app/services/loans/request-book-loan/request-book-loan.service';
import { BookNotFoundException } from '@/app/services/books/errors/book-not-found.exception';

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
        case BookNotFoundException: {
          throw new NotFoundException();
        };

        default: {
          throw new InternalServerErrorException();
        };
      }
    }
  }
}
