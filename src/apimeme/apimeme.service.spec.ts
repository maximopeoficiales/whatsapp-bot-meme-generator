import { Test, TestingModule } from '@nestjs/testing';
import { ApiMemeService } from './apimeme.service';

describe('ApimemeService', () => {
  let service: ApiMemeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiMemeService],
    }).compile();

    service = module.get<ApiMemeService>(ApiMemeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
