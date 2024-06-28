import { Body, ConflictException, Controller, InternalServerErrorException, Post, UseGuards } from '@nestjs/common';

import { CreateBookDto } from './create-book.dto';
import { CreateBookService } from '@/app/services/books/create-book/create-book.service';
import { BookISBNAlreadyExistsException } from '@/app/services/books/errors/book-isbn-already-exists.exception';
import { AuthAdminGuard } from '@/infra/guards/auth-admin.guard';
import { AuthJwtGuard } from '@/infra/guards/auth-jwt.guard';

@Controller()
export class CreateBookController {
  constructor (
    private readonly createBookService: CreateBookService,
  ) {}

  @UseGuards(AuthJwtGuard, AuthAdminGuard)
  @Post('/api/books')
  public async handle(@Body() requestDto: CreateBookDto): Promise<void> {
    try {
      await this.createBookService.execute(requestDto);
    } catch (error) {
      switch (error.constructor) {
        case BookISBNAlreadyExistsException: {
          throw new ConflictException(error.message);
        };

        default: {
          throw new InternalServerErrorException(error);
        };
      }
    }
  }
}
