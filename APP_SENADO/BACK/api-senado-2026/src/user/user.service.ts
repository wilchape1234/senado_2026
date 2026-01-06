import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
@Injectable()
class UserService {
  constructor(
    @InjectRepository(User)
    private readonly UserRepository: Repository<User>,
  ) { }

  async registerPublic(createUserDto: CreateUserDto) {
    // 💡 1. Forzar rolId a 4 para cualquier usuario de registro público
    createUserDto.rolId = 4;

    // 💡 2. Llamar al método genérico de creación/hasheo
    return this.createInternal(createUserDto);
  }

  // Método de creación por administrador (respeta el rolId enviado)
  async createByAdmin(createUserDto: CreateUserDto) {
    // 💡 Lógica de rol por defecto para el administrador, si no lo pone
    if (!createUserDto.rolId) {
      createUserDto.rolId = 4;
    }

    // 💡 Llamar al método genérico de creación/hasheo
    return this.createInternal(createUserDto);
  }

  // Método interno para el hasheo y guardado
  private async createInternal(createUserDto: CreateUserDto) {
    if (!createUserDto.password) {
      throw new Error('La contraseña es obligatoria');
    }

    const saltOrRounds = 10;
    const hash = await bcrypt.hash(createUserDto.password, saltOrRounds);
    createUserDto.password = hash;

    return await (this.UserRepository.save(createUserDto));
  }
  async findAll(): Promise<User[]> {
    return await this.UserRepository.find();
  }
  async findOne(userId: number): Promise<User> {

    const results = await this.UserRepository.findOneBy({ userId });

    if (!results) {
      throw new NotFoundException(`User con userId ${userId} no encontrada`);
    }
    return results;
  }
  async findByUsername(userName: string): Promise<User> {

    const results = await this.UserRepository.findOneBy({ userName });

    if (!results) {
      throw new NotFoundException(`User con userName ${userName} no encontrada`);
    }
    return results;
  }
  async update(userId: number, updateUserDto: UpdateUserDto): Promise<User> {

    const results = await this.findOne(userId);

    this.UserRepository.merge(results, updateUserDto);

    return await this.UserRepository.save(results);
  }
  async remove(userId: number): Promise<void> {
    const result = await this.UserRepository.delete(userId);

    if (result.affected === 0) {
      throw new NotFoundException(`User con userId ${userId} no encontrada para eliminar`);
    }
  }
}
export { UserService as UserService }