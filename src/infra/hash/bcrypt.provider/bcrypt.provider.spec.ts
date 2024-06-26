import { Test, TestingModule } from '@nestjs/testing';

import { BcryptProviderImpl } from './bcrypt.provider';

describe('BcryptProvider', () => {
  let provider: BcryptProviderImpl;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BcryptProviderImpl],
    }).compile();

    provider = module.get<BcryptProviderImpl>(BcryptProviderImpl);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
