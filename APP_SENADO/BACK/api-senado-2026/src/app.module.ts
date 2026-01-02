import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RegistroVotacionModule } from './registro_votacion/registro_votacion.module';
import { LiderModule } from './lider/lider.module';
import { RegistroVotacion } from './registro_votacion/entities/registro_votacion.entity';
import { Lider } from './lider/entities/lider.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CiudadesModule } from './ciudades/ciudades.module';
import { DepartamentosModule } from './departamentos/departamentos.module';

let modeDev2 = true;

const enties = [RegistroVotacion, Lider];

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: modeDev2 ? 3306 : 3307,
    username: 'root',
    password: modeDev2 ? '' : 'root',
    database: 'bd_senado_2026',
    entities: enties,
    synchronize: true,
  }), RegistroVotacionModule, LiderModule, CiudadesModule, DepartamentosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
