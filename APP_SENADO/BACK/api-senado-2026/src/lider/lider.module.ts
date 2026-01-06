import { Module } from '@nestjs/common';
import { LiderService } from './lider.service';
import { LiderController } from './lider.controller';
import { Lider } from './entities/lider.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Lider])],
  controllers: [LiderController],
  providers: [LiderService],
})
export class LiderModule { }
