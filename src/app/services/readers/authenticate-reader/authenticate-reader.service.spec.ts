import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticateReaderService } from './authenticate-reader.service';

describe('AuthenticateReaderService', () => {
  let service: AuthenticateReaderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthenticateReaderService],
    }).compile();

    service = module.get<AuthenticateReaderService>(AuthenticateReaderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
