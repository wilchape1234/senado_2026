import { Test, TestingModule } from '@nestjs/testing';
import { RegistroVotacionController } from './registro_votacion.controller';
import { RegistroVotacionService } from './registro_votacion.service';

describe('RegistroVotacionController', () => {
  let controller: RegistroVotacionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegistroVotacionController],
      providers: [RegistroVotacionService],
    }).compile();

    controller = module.get<RegistroVotacionController>(RegistroVotacionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
