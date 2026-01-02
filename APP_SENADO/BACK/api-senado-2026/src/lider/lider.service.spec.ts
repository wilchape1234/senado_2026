import { Test, TestingModule } from '@nestjs/testing';
import { LiderService } from './lider.service';

describe('LiderService', () => {
  let service: LiderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LiderService],
    }).compile();

    service = module.get<LiderService>(LiderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
