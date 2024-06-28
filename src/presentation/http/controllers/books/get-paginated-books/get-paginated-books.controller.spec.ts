import { Test, TestingModule } from '@nestjs/testing';
import { GetPaginatedBooksController } from './get-paginated-books.controller';

describe('GetPaginatedBooksController', () => {
  let controller: GetPaginatedBooksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetPaginatedBooksController],
    }).compile();

    controller = module.get<GetPaginatedBooksController>(GetPaginatedBooksController);
  });

  it.todo('should return a list of books paginated')
});
