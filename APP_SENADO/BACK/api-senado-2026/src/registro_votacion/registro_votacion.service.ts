// registro_votacion.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRegistroVotacionDto } from './dto/create-registro_votacion.dto';
import { UpdateRegistroVotacionDto } from './dto/update-registro_votacion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { RegistroVotacion } from './entities/registro_votacion.entity';
import { FindAllQueryDto } from './dto/find-all-query.dto';
import { toPascalCase } from 'src/utils/functions/to-pascal-case.util.ts';
// Importar la utilidad
 // Asegúrate de ajustar la ruta

@Injectable()
export class RegistroVotacionService {
  constructor(
    @InjectRepository(RegistroVotacion)
    private readonly registroVotacionRepository: Repository<RegistroVotacion>,
    private readonly dataSource: DataSource,
  ) { }

  /**
   * Aplica la transformación a PascalCase para los campos de nombres/ubicación.
   * @param registro La entidad RegistroVotacion o DTO.
   */
  private applyPascalCase(registro: Partial<RegistroVotacion>): void {
    if (registro.nombres) {
      registro.nombres = toPascalCase(registro.nombres);
    }
    if (registro.apellidos) {
      registro.apellidos = toPascalCase(registro.apellidos);
    }
    if (registro.municipioDepartamento) {
      registro.municipioDepartamento = toPascalCase(registro.municipioDepartamento);
    }
  }

  // --- MÉTODOS DE ESCRITURA (Transformación ANTES de guardar) ---

  async create(createRegistroVotacionDto: CreateRegistroVotacionDto): Promise<RegistroVotacion> {
    // Aplicar PascalCase al DTO antes de crear/guardar
    this.applyPascalCase(createRegistroVotacionDto);

    const newRegistroVotacion = this.registroVotacionRepository.create(createRegistroVotacionDto);
    return await this.registroVotacionRepository.save(newRegistroVotacion);
  }

  async update(cedula: number, updateRegistroVotacionDto: UpdateRegistroVotacionDto): Promise<RegistroVotacion> {
    const registroVotacion = await this.findOne(cedula);
    
    // Aplicar PascalCase al DTO de actualización antes de fusionar
    this.applyPascalCase(updateRegistroVotacionDto);

    this.registroVotacionRepository.merge(registroVotacion, updateRegistroVotacionDto);

    return await this.registroVotacionRepository.save(registroVotacion);
  }
  
  // --- MÉTODOS DE LECTURA (Transformación DESPUÉS de leer) ---

  async findAll(): Promise<RegistroVotacion[]> {
    const records = await this.registroVotacionRepository.find();
    // Aplicar PascalCase a cada registro antes de devolver
    records.forEach(this.applyPascalCase);
    return records;
  }
  async findAllRecords(): Promise<RegistroVotacion[]> {
    return await this.findAll(); // Reutilizamos el método con transformación
  }


  async findAllPaginated(query: FindAllQueryDto) {
    // ... (Tu lógica de queryBuilder, sin cambios en esta parte)
    const {
      limit = 100,
      skip = 0,
      search,
      sortBy = 'fechaRegistro',
      sortOrder = 'DESC'
    } = query;

    const queryBuilder = this.registroVotacionRepository.createQueryBuilder('registroVotacion');

    if (search) {
      queryBuilder.where(
        `LOWER(registroVotacion.cedula) LIKE LOWER(:search) 
         OR LOWER(registroVotacion.nombres) LIKE LOWER(:search)
         OR LOWER(registroVotacion.apellidos) LIKE LOWER(:search)
         OR LOWER(registroVotacion.correoElectronico) LIKE LOWER(:search)
         OR LOWER(registroVotacion.numeroCelular) LIKE LOWER(:search)
         OR LOWER(registroVotacion.lugarVotacion) LIKE LOWER(:search)
         OR LOWER(registroVotacion.municipioDepartamento) LIKE LOWER(:search)
         OR LOWER(registroVotacion.direccion) LIKE LOWER(:search)
         OR LOWER(registroVotacion.liderCedula) LIKE LOWER(:search)
         OR LOWER(registroVotacion.observacion) LIKE LOWER(:search)`,
        { search: `%${search}%` },
      );
    }
    
    if (sortBy && sortOrder) {
      queryBuilder.orderBy(`registroVotacion.${sortBy}`, sortOrder);
    }

    queryBuilder.take(limit);
    queryBuilder.skip(skip);

    const [data, total] = await queryBuilder.getManyAndCount();

    // !!! APLICAR TRANSFORMACIÓN AQUÍ !!!
    data.forEach(this.applyPascalCase);

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
      throw new NotFoundException(`registroVotacion con cédula ${cedula} no encontrado`);
    }
    
    // Aplicar PascalCase antes de devolver
    this.applyPascalCase(registroVotacion); 
    return registroVotacion;
  }
  
  // Repetir el patrón para otros findBy...
  async findByCiudadMunicipio(municipioId: number): Promise<RegistroVotacion> {
    const registroVotacion = await this.registroVotacionRepository.findOneBy({ municipioId });

    if (!registroVotacion) {
      throw new NotFoundException(`registroVotacion con Ciudad o Municipio ${municipioId} no encontrado`);
    }
    this.applyPascalCase(registroVotacion);
    return registroVotacion;
  }
  
  async findByDepartamento(departamentoId: number): Promise<RegistroVotacion> {
    const registroVotacion = await this.registroVotacionRepository.findOneBy({ departamentoId });

    if (!registroVotacion) {
      throw new NotFoundException(`registroVotacion con Departamento ${departamentoId} no encontrado`);
    }
    this.applyPascalCase(registroVotacion);
    return registroVotacion;
  }
  
  // ... (otros métodos)
  async bulkInsert(records: Partial<RegistroVotacion>[]): Promise<{ insertedCount: number; errorsCount: number; message: string }> {
    // **NOTA**: Aquí aplicamos la transformación a todos los registros antes de la inserción masiva.
    records.forEach(this.applyPascalCase);
    
    const result = await this.registroVotacionRepository
      .createQueryBuilder()
      .insert()
      .into(RegistroVotacion)
      .values(records)
      .orIgnore(true)
      .execute();
      
    // ... (resto de la lógica de bulkInsert, sin cambios)
    const insertedCount = result.raw.affectedRows || result.raw.insertId.length || 0;
    const totalRecords = records.length;
    const errorsCount = totalRecords - insertedCount;

    return {
      message: 'Registro masivo completado. Los duplicados fueron ignorados.',
      insertedCount: insertedCount,
      errorsCount: errorsCount,
    };
  }
  // ... (resto de los métodos remove, etc.)
  async remove(cedula: number): Promise<void> {
    const result = await this.registroVotacionRepository.delete(cedula);

    if (result.affected === 0) {
      throw new NotFoundException(`registroVotacion con cédula ${cedula} no encontrado para eliminar`);
    }
  }
}