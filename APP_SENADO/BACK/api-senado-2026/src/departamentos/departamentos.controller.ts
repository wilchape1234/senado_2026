// src/ciudades/ciudades.controller.ts
import { Controller, Get } from '@nestjs/common';
import { DepartamentosService } from './departamentos.service';
import { Departamento } from './interfaces/departamento.interface';

@Controller('/api/v1/departamentos') // Esto define la ruta base: /ciudades
export class DepartamentosController {
    constructor(private readonly ciudadesService: DepartamentosService) { }

    @Get() // Esto define la ruta final: GET /ciudades
    async findAll(): Promise<Departamento[]> {
        return this.ciudadesService.findAll();
    }
}