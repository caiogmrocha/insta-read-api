import { Body, Controller, InternalServerErrorException, Post, UseGuards } from '@nestjs/common';
import { GetPaginatedBooksDto } from './get-paginated-books.dto';
import { GetPaginatedBooksService } from '@/app/services/books/get-paginated-books/get-paginated-books.service';
import { AuthJwtGuard } from '@/infra/guards/auth-jwt.guard';
import { AuthAdminGuard } from '@/infra/guards/auth-admin.guard';
import { AuthReaderGuard } from '@/infra/guards/auth-reader.guard';

@Controller()
export class GetPaginatedBooksController {
  constructor (
    private readonly getPaginatedBooksService: GetPaginatedBooksService,
  ) {}

  @UseGuards(AuthJwtGuard)
  @Post('/api/books')
  public async handle(@Body() requestDto: GetPaginatedBooksDto) {
    try {
      const result = await this.getPaginatedBooksService.execute(requestDto);

      return {
        data: result.data,
        total: result.total,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}