// src/ciudades/ciudades.controller.ts
import { Controller, Get } from '@nestjs/common';
import { CiudadesService } from './ciudades.service';
import { Ciudad } from './interfaces/ciudad.interface';

@Controller('/api/v1/ciudades') // Esto define la ruta base: /ciudades
export class CiudadesController {
    constructor(private readonly ciudadesService: CiudadesService) { }

    @Get() // Esto define la ruta final: GET /ciudades
    async findAll(): Promise<Ciudad[]> {
        return this.ciudadesService.findAll();
    }
}