import { DeleteBookService } from '@/app/services/books/delete-book/delete-book.service';
import { BookNotFoundException } from '@/app/services/books/errors/book-not-found.exception';
import { Controller, Delete, InternalServerErrorException, NotFoundException, Param, UseGuards } from '@nestjs/common';
import { DeleteBookDto } from './delete-book.dto';
import { AuthJwtGuard } from '@/infra/guards/auth-jwt.guard';
import { AuthAdminGuard } from '@/infra/guards/auth-admin.guard';

@Controller()
export class DeleteBookController {
  constructor (
    private readonly deleteBookService: DeleteBookService
  ) {}

  @UseGuards(AuthJwtGuard, AuthAdminGuard)
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
