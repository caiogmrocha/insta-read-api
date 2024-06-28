import { CreateBookService } from '@/app/services/books/create-book/create-book.service';
import { Body, ConflictException, Controller, InternalServerErrorException, Post } from '@nestjs/common';
import { CreateBookDto } from './create-book.dto';
import { BookISBNAlreadyExistsException } from '@/app/services/books/create-book/errors/book-isbn-already-exists.exception';

@Controller()
export class CreateBookController {
  constructor (
    private readonly createBookService: CreateBookService,
  ) {}

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
