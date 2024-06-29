import { UpdateBookService } from '@/app/services/books/update-book/update-book.service';
import { Body, ConflictException, Controller, InternalServerErrorException, NotFoundException, Param, Put } from '@nestjs/common';
import { UpdateBookBodyDto, UpdateBookParamsDto } from './update-book.dto';
import { BookNotFoundException } from '@/app/services/books/errors/book-not-found.exception';
import { BookISBNAlreadyExistsException } from '@/app/services/books/errors/book-isbn-already-exists.exception';

@Controller()
export class UpdateBookController {
  constructor (
    private readonly updateBookService: UpdateBookService,
  ) {}

  @Put('/api/books/:id')
  public async handle(
    @Param() params: UpdateBookParamsDto,
    @Body() body: UpdateBookBodyDto,
  ): Promise<void> {
    try {
      await this.updateBookService.execute({
        id: params.id,
        ...body,
      });
    } catch (error) {
      switch (error.constructor) {
        case BookNotFoundException: {
          throw new NotFoundException(error.message);
        };

        case BookISBNAlreadyExistsException: {
          throw new ConflictException(error.message);
        };

        default: {
          throw new InternalServerErrorException(error.message);
        };
      }
    }
  }
}
