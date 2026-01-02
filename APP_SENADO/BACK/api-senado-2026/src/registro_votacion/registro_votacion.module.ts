import { Module } from '@nestjs/common';
import { RegistroVotacionService } from './registro_votacion.service';
import { RegistroVotacionController } from './registro_votacion.controller';
import { RegistroVotacion } from './entities/registro_votacion.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([RegistroVotacion])],
  controllers: [RegistroVotacionController],
  providers: [RegistroVotacionService],
})
export class RegistroVotacionModule { }
