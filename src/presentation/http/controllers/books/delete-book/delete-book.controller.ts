import { DeleteBookService } from '@/app/services/books/delete-book/delete-book.service';
import { BookNotFoundException } from '@/app/services/books/errors/book-not-found.exception';
import { Controller, Delete, InternalServerErrorException, NotFoundException, Param } from '@nestjs/common';
import { DeleteBookDto } from './delete-book.dto';

@Controller()
export class DeleteBookController {
  constructor (
    private readonly deleteBookService: DeleteBookService
  ) {}

  @Delete('/api/books/:id')
  public async handle(@Param() params: DeleteBookDto): Promise<void> {
    try {
      await this.deleteBookService.execute(params);
    } catch (error) {
      switch (error.constructor) {
        case BookNotFoundException: {
          throw new NotFoundException(error.message);
        };

        default: {
          throw new InternalServerErrorException(error.message);
        };
      }
    }
  }
}
