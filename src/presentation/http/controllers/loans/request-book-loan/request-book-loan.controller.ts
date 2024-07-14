import { Body, ConflictException, Controller, HttpCode, HttpStatus, InternalServerErrorException, NotFoundException, Post, Req, UseGuards } from '@nestjs/common';

import { RequestBookLoanBodyDto } from './request-book-loan.dto';
import { RequestBookLoanService } from '@/app/services/loans/request-book-loan/request-book-loan.service';
import { BookNotFoundException } from '@/app/services/books/errors/book-not-found.exception';
import { ReaderNotFoundException } from '@/app/services/readers/errors/reader-not-found.exception';
import { BookLoanRequestAlreadyExistsException } from '@/app/services/loans/errors/book-loan-request-already-exists.exception';
import { AuthJwtGuard } from '@/infra/guards/auth-jwt.guard';
import { AuthReaderGuard } from '@/infra/guards/auth-reader.guard';
import { Request } from 'express';

@Controller()
export class RequestBookLoanController {
  constructor (
    private readonly requestBookLoanService: RequestBookLoanService,
  ) {}

  @UseGuards(AuthJwtGuard, AuthReaderGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('/api/readers/loans/request-book')
  public async handle(
    @Req() request: Request,
    @Body() body: RequestBookLoanBodyDto,
  ): Promise<void> {
    try {
      await this.requestBookLoanService.execute({
        readerId: request.user!.id,
        bookId: body.bookId,
      });
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
