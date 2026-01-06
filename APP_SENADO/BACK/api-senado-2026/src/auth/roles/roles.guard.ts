// src/auth/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Obtener los roles requeridos definidos en la ruta (@Roles(1, 2))
    const requiredRoles = this.reflector.getAllAndOverride<number[]>(ROLES_KEY, [
      context.getHandler(), // Para el método
      context.getClass(),    // Para la clase (controlador)
    ]);

    // Si no hay roles definidos, la ruta es pública para cualquier usuario autenticado
    if (!requiredRoles) {
      return true;
    }

    // 2. Obtener la información del usuario del Request (puesta por el JwtAuthGuard)
    // El payload del token, req.user, contendrá el 'rolId' si lo agregamos al token (Ver Paso 3)
    const { user } = context.switchToHttp().getRequest();
    
    // 3. Verificar si el rol del usuario está en la lista de roles requeridos
    return requiredRoles.some((role) => user.rolId === role);
  }
}