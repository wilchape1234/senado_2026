// src/solicitud-comision/dto/find-all-query.dto.ts

import { IsOptional, IsString, IsInt, Min, Max, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class FindAllQueryDto {

  @IsOptional()
  @Type(() => Number) // IMPORTANTE: Transforma de string a number
  @IsInt()
  @Min(1)
  page: number = 1; // Página por defecto

  // Parámetro para el desplazamiento (equivalente a "skip")
  @Type(() => Number) // <--- ¡Esta es la clave para la transformación a Number!
  @IsNumber()
  @IsOptional()
  @Min(0)
  readonly skip?: number = 0; // Valor por defecto
  
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 100; // Límite por defecto (ej: 100 registros)

  @IsOptional()
  @IsString()
  search?: string; // Término de búsqueda (por ejemplo, en nombre o código)

  @IsOptional()
  @IsString()
  status?: string; // Filtro por campo 'status' (o cualquier otro campo)

  @IsOptional()
  @IsString()
  sortBy?: string; // Campo para ordenar (ej: 'fechaCreacion')

  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC'; // Dirección de ordenamiento

}