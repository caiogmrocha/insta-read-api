import { Test, TestingModule } from '@nestjs/testing';
import { UpdateBookService } from './update-book.service';

describe('UpdateBookService', () => {
  let service: UpdateBookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpdateBookService],
    }).compile();

    service = module.get<UpdateBookService>(UpdateBookService);
  });

  it.todo('should throw BookNotFoundException when book does not exist');
  it.todo('should throw BookISBNAlreadyExistsException when ISBN already exists');
  it.todo('should update the book');
});
