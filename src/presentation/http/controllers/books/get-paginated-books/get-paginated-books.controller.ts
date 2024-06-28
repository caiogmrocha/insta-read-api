import { Body, Controller, InternalServerErrorException, Post } from '@nestjs/common';
import { GetPaginatedBooksDto } from './get-paginated-books.dto';
import { GetPaginatedBooksService } from '@/app/services/books/get-paginated-books/get-paginated-books.service';

@Controller()
export class GetPaginatedBooksController {
  constructor (
    private readonly getPaginatedBooksService: GetPaginatedBooksService,
  ) {}

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
