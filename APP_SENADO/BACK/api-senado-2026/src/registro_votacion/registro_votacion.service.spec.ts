import { Test, TestingModule } from '@nestjs/testing';
import { RegistroVotacionService } from './registro_votacion.service';

describe('RegistroVotacionService', () => {
  let service: RegistroVotacionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RegistroVotacionService],
    }).compile();

    service = module.get<RegistroVotacionService>(RegistroVotacionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
