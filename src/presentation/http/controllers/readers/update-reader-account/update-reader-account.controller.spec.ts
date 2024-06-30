import { Test, TestingModule } from '@nestjs/testing';
import { UpdateReaderAccountController } from './update-reader-account.controller';

describe('UpdateReaderAccountController', () => {
  let controller: UpdateReaderAccountController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UpdateReaderAccountController],
    }).compile();

    controller = module.get<UpdateReaderAccountController>(UpdateReaderAccountController);
  });

  it.todo('should response with 404 when reader not found');
  it.todo('should response with 409 when email already exists');
  it.todo('should response with 204 when reader updated');
});
