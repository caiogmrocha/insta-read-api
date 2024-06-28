import { Test, TestingModule } from '@nestjs/testing';
import { GetPaginatedBooksService } from './get-paginated-books.service';

describe('GetPaginatedBooksService', () => {
  let service: GetPaginatedBooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GetPaginatedBooksService],
    }).compile();

    service = module.get<GetPaginatedBooksService>(GetPaginatedBooksService);
  });

  it.todo('should return a list of books paginated');
  it.todo(
    'should return a list of books paginated with default values when no params are provided',
  );
  it.todo(
    'should return a list of books paginated with default values when invalid params are provided',
  );
});
