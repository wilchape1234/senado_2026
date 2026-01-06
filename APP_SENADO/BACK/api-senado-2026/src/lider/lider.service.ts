import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLiderDto } from './dto/create-lider.dto';
import { UpdateLiderDto } from './dto/update-lider.dto';
import { Lider } from './entities/lider.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class LiderService {
  constructor(
    @InjectRepository(Lider)
    private readonly liderRepository: Repository<Lider>,
  ) { }

  async create(createLiderDto: CreateLiderDto) {
    return await (this.liderRepository.save(createLiderDto));
  }
  async findAll(): Promise<Lider[]> {
    return await this.liderRepository.find();
  }
  async findOne(cedula: number): Promise<Lider> {

    const results = await this.liderRepository.findOneBy({ cedula });

    if (!results) {
      throw new NotFoundException(`Lider con cedula ${cedula} no encontrada`);
    }
    return results;
  }
  async update(cedula: number, updateLiderDto: UpdateLiderDto): Promise<Lider> {

    const results = await this.findOne(cedula);

    this.liderRepository.merge(results, updateLiderDto);

    return await this.liderRepository.save(results);
  }
  async remove(cedula: number): Promise<void> {
    const result = await this.liderRepository.delete(cedula);

    if (result.affected === 0) {
      throw new NotFoundException(`Lider con cedula ${cedula} no encontrada para eliminar`);
    }
  }
}
