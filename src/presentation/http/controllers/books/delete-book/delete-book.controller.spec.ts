import { Test, TestingModule } from '@nestjs/testing';
import { DeleteBookController } from './delete-book.controller';

describe('DeleteBookController', () => {
  let controller: DeleteBookController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeleteBookController],
    }).compile();

    controller = module.get<DeleteBookController>(DeleteBookController);
  });

  it.todo('should response with 204 if the book was deleted successfully');
  it.todo('should response with 404 if the book does not exist');
  it.todo('should response with 500 if something unexpected happens when trying to delete the book');
});
