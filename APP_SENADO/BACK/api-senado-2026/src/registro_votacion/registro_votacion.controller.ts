import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RegistroVotacionService } from './registro_votacion.service';
import { CreateRegistroVotacionDto } from './dto/create-registro_votacion.dto';
import { UpdateRegistroVotacionDto } from './dto/update-registro_votacion.dto';
import { BulkInsertDto } from './dto/bulk-insert-dto';
import { FindAllQueryDto } from './dto/find-all-query.dto';

const apiEnpoint = '/api/v1/registro-votacion';
const url = 'http://192.168.18.19:3000';
const urlApi = url + apiEnpoint;
@Controller(apiEnpoint)
export class RegistroVotacionController {
  constructor(private readonly registroVotacionService: RegistroVotacionService) { }

  /*   @Post()
    create(@Body() createRegistroVotacionDto: CreateRegistroVotacionDto) {
      return this.registroVotacionService.create(createRegistroVotacionDto);
    }
  
    @Get()
    findAll() {
      return this.registroVotacionService.findAll();
    }
  
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.registroVotacionService.findOne(+id);
    }
  
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateRegistroVotacionDto: UpdateRegistroVotacionDto) {
      return this.registroVotacionService.update(+id, updateRegistroVotacionDto);
    }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.registroVotacionService.remove(+id);
    }
   */

  @Post()
  create(@Body() createRegistroVotacionDto: CreateRegistroVotacionDto) {
    return this.registroVotacionService.create(createRegistroVotacionDto);
  }
  // @Post('/migracion-masiva')
  @Post('migracion-masiva') // El path completo será /api/v1/funcionario-empleado/migracion-masiva
  async bulkInsert(@Body() bulkData: BulkInsertDto) {
    // bulkData.records contiene el array de funcionarios del CSV
    console.log(`Recibiendo ${bulkData.records.length} registros para migración...`);

    // Llamamos al Service para manejar la lógica de inserción y transacción
    const resultado = await this.registroVotacionService.bulkInsert(bulkData.records);

    return {
      message: 'Proceso de migración masiva completado.',
      insertedCount: resultado.insertedCount,
      errorsCount: resultado.errorsCount,
      // Opcional: devolver los errores específicos si existen
      // errors: resultado.errors 
    };
  }

  /*   @Get()
    findAll() {
      return this.registroVotacionService.findAll();
    } */
  @Get()
  findAll(@Query() query: FindAllQueryDto) {
    return this.registroVotacionService.findAllPaginated(query);
  }
  @Get('all')
  findAllRecords() {
    return this.registroVotacionService.findAll();
  }

  @Get(':cedula')
  findOne(@Param('cedula') cedula: string) {
    return this.registroVotacionService.findOne(+cedula);
  }
  @Get(':departamentoId')
  findByDepartamento(@Param('departamentoId') departamentoId: string) {
    return this.registroVotacionService.findOne(+departamentoId);
  }

  @Get(':municipioId')
  findByCiudadMunicipio(@Param('municipioId') municipioId: string) {
    return this.registroVotacionService.findOne(+municipioId);
  }

  @Patch(':cedula')
  update(@Param('cedula') cedula: string, @Body() updateRegistroVotacionDto: UpdateRegistroVotacionDto) {
    return this.registroVotacionService.update(+cedula, updateRegistroVotacionDto);
  }

  @Delete(':cedula')
  remove(@Param('cedula') cedula: string) {
    return this.registroVotacionService.remove(+cedula);
  }
}
