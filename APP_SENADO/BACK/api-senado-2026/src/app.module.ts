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
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { JuradoModule } from './jurado/jurado.module';
import { Jurado } from './jurado/entities/jurado.entity';
import { User } from './user/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { Auth } from './auth/entities/auth.entity';
// <-- Importar ConfigModule y ConfigService

const enties = [RegistroVotacion, Lider, Jurado, User, Auth];

@Module({
  imports: [
    // 1. ConfigModule para cargar .env
    ConfigModule.forRoot({
      isGlobal: true, // Esto hace que ConfigService esté disponible en toda la aplicación
    }),

    // 2. Usar TypeOrmModule.forRootAsync para inyectar ConfigService
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Importa ConfigModule si no es global
      useFactory: (configService: ConfigService) => {
        // Lógica para determinar si es entorno de desarrollo
        const isDevelopment = configService.get('NODE_ENV') === 'development';

        return {
          type: 'mysql',
          host: configService.get<string>('DB_HOST'),
          port: isDevelopment
            ? configService.get<number>('DB_PORT_DEV')
            : configService.get<number>('DB_PORT_PROD'),
          username: configService.get<string>('DB_USERNAME'),
          password: isDevelopment
            ? configService.get<string>('DB_PASSWORD_DEV')
            : configService.get<string>('DB_PASSWORD_PROD'),
          database: isDevelopment
            ? configService.get<string>('DB_DATABASE_DEV')
            : configService.get<string>('DB_DATABASE_PROD'),
          entities: enties,
          synchronize: true,
          extra: {
            connectionLimit: 10,
            dateStrings: true, 
          },
        };
      },
      inject: [ConfigService], // Asegura que ConfigService sea inyectado
    }),

    RegistroVotacionModule,
    LiderModule,
    CiudadesModule,
    DepartamentosModule, UserModule, JuradoModule, AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }