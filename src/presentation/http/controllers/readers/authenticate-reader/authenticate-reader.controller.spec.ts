import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticateReaderController } from './authenticate-reader.controller';

describe('AuthenticateReaderController', () => {
  let controller: AuthenticateReaderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticateReaderController],
    }).compile();

    controller = module.get<AuthenticateReaderController>(AuthenticateReaderController);
  });

  it.todo('should response with 200 when reader is authenticated');
  it.todo('should response with 404 when reader does not exist');
  it.todo('should response with 409 when password is invalid');
  it.todo('should response with 500 status code when an unexpected error occurs');
});
