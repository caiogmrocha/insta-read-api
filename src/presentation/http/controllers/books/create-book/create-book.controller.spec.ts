import { Test, TestingModule } from '@nestjs/testing';
import { CreateBookController } from './create-book.controller';

describe('CreateBookController', () => {
  let controller: CreateBookController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateBookController],
    }).compile();

    controller = module.get<CreateBookController>(CreateBookController);
  });

  it.todo('should response with 201 status code when book is created');
  it.todo('should response with 400 status code when ISBN already exists');
  it.todo('should response with 500 status code when an unexpected error occurs');
});
