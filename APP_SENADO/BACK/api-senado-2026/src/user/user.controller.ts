import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { RolesGuard } from 'src/auth/roles/roles.guard';

@Controller('api/v1/user')
export class UserController {
  constructor(private readonly userService: UserService) { }

// 1. ENDPOINT: REGISTRO PÚBLICO (No requiere token)
  // Ruta: POST /api/v1/user/register
  @Post('register')
  registerPublic(@Body() createUserDto: CreateUserDto) {
    // Este método fuerza el rolId a 4 internamente.
    return this.userService.registerPublic(createUserDto);
  }

  // 2. ENDPOINT: CREACIÓN POR ADMINISTRADOR (Requiere token de rol 1 o 2)
  // Ruta: POST /api/v1/user/admin
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(1, 2) // Solo roles 1 y 2 pueden acceder a esta ruta
  @Post('admin')
  createByAdmin(@Body() createUserDto: CreateUserDto, @Request() req) {
    const creatorRolId = req.user.rolId; // Rol del usuario logueado

    // Lógica de seguridad: Restringir la creación de Admins (1 o 2)
    // si el creador es rol 2 (o cualquier rol que no sea 1).
    if (
      (createUserDto.rolId === 1 || createUserDto.rolId === 2) && 
      creatorRolId !== 1
    ) {
      throw new ForbiddenException('Solo un Super-Admin (rol 1) puede asignar roles de Admin (1 o 2).');
    }

    // Este método respeta el rolId enviado en el DTO (o asigna 4 si no se envía).
    return this.userService.createByAdmin(createUserDto);
  }

  // 3. OTRA RUTA PROTEGIDA (Requiere token)

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Request() req) {
    console.log(req.user);
    return this.userService.findAll();
  }

  @Get(':userId')
  findOne(@Param('userId') userId: string) {
    return this.userService.findOne(+userId);
  }

  @Patch(':userId')
  update(@Param('userId') userId: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+userId, updateUserDto);
  }

  @Delete(':userId')
  remove(@Param('userId') userId: string) {
    return this.userService.remove(+userId);
  }
}
