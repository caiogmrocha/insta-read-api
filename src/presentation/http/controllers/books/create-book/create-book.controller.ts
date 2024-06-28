import { CreateBookService } from '@/app/services/books/create-book/create-book.service';
import { Body, Controller, Post } from '@nestjs/common';
import { CreateBookDto } from './create-book.dto';

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
      console.error(error);
    }
  }
}
