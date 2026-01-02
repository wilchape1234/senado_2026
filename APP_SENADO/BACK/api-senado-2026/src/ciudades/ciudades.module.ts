import { Module } from '@nestjs/common';
// 1. IMPORTAR HttpModule DESDE @nestjs/axios
import { HttpModule } from '@nestjs/axios'; 
import { CiudadesController } from './ciudades.controller';
import { CiudadesService } from './ciudades.service'; // Asegúrate de que CiudadesService también esté importado

@Module({
  imports: [
    HttpModule, // Necesario para usar el HttpService de NestJS
  ], 
  controllers: [CiudadesController],
  providers: [CiudadesService],
  exports: [CiudadesService],
})
export class CiudadesModule {}