import { Test, TestingModule } from '@nestjs/testing';
import { RequestBookLoanController } from './request-book-loan.controller';

describe('RequestBookLoanController', () => {
  let controller: RequestBookLoanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequestBookLoanController],
    }).compile();

    controller = module.get<RequestBookLoanController>(RequestBookLoanController);
  });

  it.todo('should response with 404 status code when book is not found');
  it.todo('should response with 404 status code when reader is not found');
  it.todo('should response with 409 status code when book loan request already exists');
  it.todo('should response with 201 status code when request book loan is successful');
});
