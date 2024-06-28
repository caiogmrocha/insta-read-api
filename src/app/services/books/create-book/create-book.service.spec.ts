import { Test, TestingModule } from '@nestjs/testing';
import { CreateBookService } from './create-book.service';

describe('CreateBookService', () => {
  let service: CreateBookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateBookService],
    }).compile();

    service = module.get<CreateBookService>(CreateBookService);
  });

  it.todo('should throw BookISBNAlreadyExistsException when ISBN already exists');
  it.todo('should create a new book');
});
