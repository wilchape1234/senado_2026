import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { firstValueFrom, catchError } from 'rxjs';
import { Ciudad } from './interfaces/ciudad.interface';
import { HttpService } from '@nestjs/axios';

// ... (Resto de imports)

@Injectable()
export class CiudadesService {
    private readonly logger = new Logger(CiudadesService.name);
    private readonly API_URL = 'https://api-colombia.com/api/v1/City';

    private readonly STATIC_DATA_PATH = path.join(process.cwd(), 'src', 'assets', 'ciudades', 'ciudades.json')

    constructor(private readonly httpService: HttpService) { }

    async findAll(): Promise<Ciudad[]> {
        this.logger.log(`Intentando obtener datos de la API: ${this.API_URL}`);

        try {
            const response = await firstValueFrom(
                this.httpService.get<Ciudad[]>(this.API_URL).pipe(
                    catchError(error => {
                        this.logger.error(`Fallo de la API: ${error.message}`, error.stack);
                        throw new Error('API_FETCH_FAILED');
                    })
                )
            );

            const data: Ciudad[] = response.data;

            // 🌟 PASO CLAVE 1: Actualizar el archivo estático con los datos nuevos
            await this.saveStaticData(data);

            this.logger.log('Datos obtenidos y archivo estático actualizado con éxito.');
            return data;

        } catch (error) {
            this.logger.warn('Fallo al obtener datos de la API. Usando datos estáticos locales como fallback.');
            return this.getStaticData();
        }
    }

    /**
     * Guarda la lista de Ciudades en el archivo JSON estático.
     */
private async saveStaticData(data: Ciudad[]): Promise<void> {
        try {
            // 1. Obtener la ruta del directorio
            const dirPath = path.dirname(this.STATIC_DATA_PATH);

            // 2. Crear los directorios recursivamente si no existen
            // Si la carpeta ya existe, esta llamada no hace nada.
            fs.mkdirSync(dirPath, { recursive: true });

            // 3. Escribir el archivo
            const jsonContent = JSON.stringify(data, null, 2); 
            fs.writeFileSync(this.STATIC_DATA_PATH, jsonContent, 'utf-8');

            this.logger.debug('Archivo ciudades.json escrito correctamente.');
        } catch (writeError) {
            this.logger.error(`Error al escribir en el archivo estático: ${writeError.message}`);
        }
    }

    /**
     * Función auxiliar para leer el archivo JSON estático.
     */
    private getStaticData(): Ciudad[] {
        try {
            const fileContent = fs.readFileSync(this.STATIC_DATA_PATH, 'utf-8');
            const staticData: Ciudad[] = JSON.parse(fileContent);
            return staticData;
        } catch (readError) {
            this.logger.error(`Error al leer el archivo estático: ${readError.message}`);
            return [];
        }
    }
}