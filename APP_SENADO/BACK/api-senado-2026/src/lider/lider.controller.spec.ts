import { Test, TestingModule } from '@nestjs/testing';
import { LiderController } from './lider.controller';
import { LiderService } from './lider.service';

describe('LiderController', () => {
  let controller: LiderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LiderController],
      providers: [LiderService],
    }).compile();

    controller = module.get<LiderController>(LiderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
