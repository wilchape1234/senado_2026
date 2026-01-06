
// src/auth/jwt.strategy.ts

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport'; 
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from './constants/constants'; 
import { PayloadUser } from './entities/auth.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
      ignoreExpiration: false, 
      secretOrKey: jwtConstants.secret, 
    });
  }

  // SOLUCIÓN: Añadir rolId al objeto devuelto
  async validate(payload: PayloadUser):Promise<PayloadUser> {
    return { 
      UID: payload.UID, 
      userName: payload.userName,
      rolId: payload.rolId // <--- ¡AÑADIR ESTA LÍNEA!
    };
  }
}