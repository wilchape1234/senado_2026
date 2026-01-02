import { Injectable } from '@nestjs/common';
import { CreateLiderDto } from './dto/create-lider.dto';
import { UpdateLiderDto } from './dto/update-lider.dto';

@Injectable()
export class LiderService {
  create(createLiderDto: CreateLiderDto) {
    return 'This action adds a new lider';
  }

  findAll() {
    return `This action returns all lider`;
  }

  findOne(id: number) {
    return `This action returns a #${id} lider`;
  }

  update(id: number, updateLiderDto: UpdateLiderDto) {
    return `This action updates a #${id} lider`;
  }

  remove(id: number) {
    return `This action removes a #${id} lider`;
  }
}
