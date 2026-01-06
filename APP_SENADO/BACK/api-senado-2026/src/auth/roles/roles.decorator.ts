// src/auth/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';

// Definimos la clave que usará NestJS para guardar los roles en los metadatos de la ruta
export const ROLES_KEY = 'roles'; 

// Este decorador se usa así: @Roles(1, 2)
export const Roles = (...roles: number[]) => SetMetadata(ROLES_KEY, roles);