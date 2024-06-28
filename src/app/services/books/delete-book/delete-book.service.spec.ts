import { Test, TestingModule } from '@nestjs/testing';
import { DeleteBookService } from './delete-book.service';

describe('DeleteBookService', () => {
  let service: DeleteBookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeleteBookService],
    }).compile();

    service = module.get<DeleteBookService>(DeleteBookService);
  });

  it.todo('should throw an error if the book does not exist');
  it.todo('should delete a book');
});
