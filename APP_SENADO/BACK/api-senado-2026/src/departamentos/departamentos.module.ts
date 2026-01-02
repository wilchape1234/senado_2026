import { Module } from '@nestjs/common';
// 1. IMPORTAR HttpModule DESDE @nestjs/axios
import { HttpModule } from '@nestjs/axios'; 

import { DepartamentosService } from './departamentos.service'; // Asegúrate de que CiudadesService también esté importado
import { DepartamentosController } from './departamentos.controller';

@Module({
  imports: [
    HttpModule, // Necesario para usar el HttpService de NestJS
  ], 
  controllers: [DepartamentosController],
  providers: [DepartamentosService],
  exports: [DepartamentosService],
})
export class DepartamentosModule {}