import { Module } from '@nestjs/common';
import { JuradoService } from './jurado.service';
import { JuradoController } from './jurado.controller';
import { Jurado } from './entities/jurado.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Jurado])],
  controllers: [JuradoController],
  providers: [JuradoService],
})
export class JuradoModule { }
