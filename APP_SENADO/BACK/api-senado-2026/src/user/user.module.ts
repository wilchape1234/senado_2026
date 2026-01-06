import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
  // 💡 AÑADE ESTA LÍNEA para que UserService esté disponible
  // para otros módulos que importen UserModule (como AuthModule).
  exports: [UserService],
})
export class UserModule { }
