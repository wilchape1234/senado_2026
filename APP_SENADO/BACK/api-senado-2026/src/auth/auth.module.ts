import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { jwtConstants } from './constants/constants';
import { JwtModule } from '@nestjs/jwt';

import { JwtStrategy } from './jwt.strategy'; // <--- Importar estrategia

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '2h' }, // ¡Recomendado usar más de 60s!
    }),
  ],
  providers: [AuthService, JwtStrategy], // <--- ¡Añadir JwtStrategy aquí!
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule { }