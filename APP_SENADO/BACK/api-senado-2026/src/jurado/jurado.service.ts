import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateJuradoDto } from './dto/create-jurado.dto';
import { UpdateJuradoDto } from './dto/update-jurado.dto';
import { Jurado } from './entities/jurado.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class JuradoService {
  constructor(
    @InjectRepository(Jurado)
    private readonly juradoRepository: Repository<Jurado>,
  ) { }

  async create(createJuradoDto: CreateJuradoDto) {
    return await (this.juradoRepository.save(createJuradoDto));
  }
  async findAll(): Promise<Jurado[]> {
    return await this.juradoRepository.find();
  }
  async findOne(cedula: number): Promise<Jurado> {

    const results = await this.juradoRepository.findOneBy({ cedula });

    if (!results) {
      throw new NotFoundException(`Jurado con cedula ${cedula} no encontrada`);
    }
    return results;
  }
  async update(cedula: number, updateJuradoDto: UpdateJuradoDto): Promise<Jurado> {

    const results = await this.findOne(cedula);

    this.juradoRepository.merge(results, updateJuradoDto);

    return await this.juradoRepository.save(results);
  }
  async remove(cedula: number): Promise<void> {
    const result = await this.juradoRepository.delete(cedula);

    if (result.affected === 0) {
      throw new NotFoundException(`Jurado con cedula ${cedula} no encontrada para eliminar`);
    }
  }
}
