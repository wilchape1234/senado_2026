import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'; // <--- 1. Importar bcrypt
import { PayloadUser } from './entities/auth.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService
  ) { }

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    // Busca el usuario (esto lanzará NotFoundException si no existe, según tu user.service.ts)
    const user = await this.usersService.findByUsername(username);

    // 2. Comparar la contraseña plana (pass) con el hash de la DB (user.password)
    const isMatch = await bcrypt.compare(pass, user.password);

    // 3. Si no coinciden, lanzar error
    if (!isMatch) {
      throw new UnauthorizedException();
    }

    // 4. Si coinciden, generar el token
    const payload:PayloadUser = {
      UID: user.userId,
      userName: user.userName,
      // 💡 AÑADIR EL ROL AL PAYLOAD DEL TOKEN
      rolId: user.rolId
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}