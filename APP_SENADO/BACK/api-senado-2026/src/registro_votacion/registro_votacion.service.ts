import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRegistroVotacionDto } from './dto/create-registro_votacion.dto';
import { UpdateRegistroVotacionDto } from './dto/update-registro_votacion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { RegistroVotacion } from './entities/registro_votacion.entity';
import { FindAllQueryDto } from './dto/find-all-query.dto';

@Injectable()
export class RegistroVotacionService {
  /*   create(createRegistroVotacionDto: CreateRegistroVotacionDto) {
      return 'This action adds a new registroVotacion';
    }
  
    findAll() {
      return `This action returns all registroVotacion`;
    }
  
    findOne(id: number) {
      return `This action returns a #${id} registroVotacion`;
    }
  
    update(id: number, updateRegistroVotacionDto: UpdateRegistroVotacionDto) {
      return `This action updates a #${id} registroVotacion`;
    }
  
    remove(id: number) {
      return `This action removes a #${id} registroVotacion`;
    } */
  constructor(
    @InjectRepository(RegistroVotacion)
    private readonly registroVotacionRepository: Repository<RegistroVotacion>,
    private readonly dataSource: DataSource,
  ) { }

  async create(createRegistroVotacionDto: CreateRegistroVotacionDto): Promise<RegistroVotacion> {
    const newRegistroVotacion = this.registroVotacionRepository.create(createRegistroVotacionDto);
    return await this.registroVotacionRepository.save(newRegistroVotacion);
  }
  /**
       * Procesa la inserción masiva de funcionarios dentro de una transacción.
       */
  async bulkInsert(records: Partial<RegistroVotacion>[]): Promise<{ insertedCount: number; errorsCount: number; message: string }> {

    // **NOTA**: Aquí puedes agregar la lógica de transformación de tipos (ej. Date)
    // si el CSV/Excel no los trae listos para la entidad. Por ahora, asumimos que
    // los datos ya están en el formato correcto (Partial<FuncionarioEmpleado>[]).

    const result = await this.registroVotacionRepository
      .createQueryBuilder()
      .insert()
      .into(RegistroVotacion)
      .values(records)
      .orIgnore(true) // <<-- ESTA ES LA CLAVE PARA IGNORAR DUPLICADOS DE 'cedula'
      .execute();

    // El 'affectedRows' indica cuántos se insertaron realmente.
    const insertedCount = result.raw.affectedRows || result.raw.insertId.length || 0;
    const totalRecords = records.length;

    // Registros totales menos los insertados = Registros duplicados/saltados
    const errorsCount = totalRecords - insertedCount;

    return {
      message: 'Registro masivo completado. Los duplicados fueron ignorados.',
      insertedCount: insertedCount,
      errorsCount: errorsCount,
    };
  }
  async findAll(): Promise<RegistroVotacion[]> {
    return await this.registroVotacionRepository.find();
  }
  async findAllPaginated(query: FindAllQueryDto) {
    // 1. Desestructurar y usar valores por defecto
    const {
      limit = 100,
      skip = 0,
      search,
      sortBy = 'apellidos', // Puedes elegir un valor por defecto
      sortOrder = 'DESC'
    } = query;

    const queryBuilder = this.registroVotacionRepository.createQueryBuilder('registroVotacion');

    // 2. APLICAR LA CORRECCIÓN DEL ERROR DE SINTAXIS:
    // Solo construir la cláusula WHERE si el término de búsqueda existe.
    if (search) {
      // Usamos .where() e incluimos TODOS los campos de búsqueda con el paréntesis de cierre.
      // Incluí 'nombre' y 'cedula' y 'apellidos' ya que son comunes para búsqueda.
      queryBuilder.where(
        `LOWER(registroVotacion.cedula) LIKE LOWER(:search) 
         OR LOWER(registroVotacion.nombres) LIKE LOWER(:search)
         OR LOWER(registroVotacion.apellidos) LIKE LOWER(:search)
         OR LOWER(registroVotacion.correoElectronico) LIKE LOWER(:search)
         OR LOWER(registroVotacion.numeroCelular) LIKE LOWER(:search)
         OR LOWER(registroVotacion.lugarVotacion) LIKE LOWER(:search)
         OR LOWER(registroVotacion.direccion) LIKE LOWER(:search)
         OR LOWER(registroVotacion.liderCedula) LIKE LOWER(:search)
         OR LOWER(registroVotacion.observacion) LIKE LOWER(:search)`,
        { search: `%${search}%` },
      );
    }
    // Si 'search' no existe, no se llama a .where(), resultando en un SELECT * FROM ... válido.

    // 3. Aplicar ordenamiento
    if (sortBy && sortOrder) {
      queryBuilder.orderBy(`registroVotacion.${sortBy}`, sortOrder);
    }

    // 4. Aplicar paginación (limit/take y skip)
    queryBuilder.take(limit);
    queryBuilder.skip(skip);

    // 5. Ejecutar la consulta para obtener los datos y el conteo total
    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      limit,
      skip,
    };
  }
  async findOne(cedula: number): Promise<RegistroVotacion> {

    const registroVotacion = await this.registroVotacionRepository.findOneBy({ cedula });

    if (!registroVotacion) {
      throw new NotFoundException(`registroVotacioncon cédula ${cedula} no encontrado`);
    }
    return registroVotacion;
  }

  async update(cedula: number, updateRegistroVotacionDto: UpdateRegistroVotacionDto): Promise<RegistroVotacion> {

    const registroVotacion = await this.findOne(cedula);

    this.registroVotacionRepository.merge(registroVotacion, updateRegistroVotacionDto);

    return await this.registroVotacionRepository.save(registroVotacion);
  }

  async remove(cedula: number): Promise<void> {
    const result = await this.registroVotacionRepository.delete(cedula);

    if (result.affected === 0) {
      throw new NotFoundException(`registroVotacioncon cédula ${cedula} no encontrado para eliminar`);
    }
  }
}
