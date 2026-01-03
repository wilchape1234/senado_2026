/* GetData.ts */

import axios, { type AxiosResponse } from 'axios';
import type { Ciudad, Departamento, RegistroVotacion } from '../Types/interfaces';

// --- CONFIGURACIÓN ---
export let dinamicHost = window.location.hostname;
const PORT = 3000;
const BASE_URL_SERVER_API = dinamicHost;
// const BASE_URL_SERVER_API = 'localhost'; 
const API_REG_VOTACION_ENDPOINT = `http://${BASE_URL_SERVER_API}:${PORT}/api/v1/registro-votacion`;
// NUEVO ENDPOINT PARA LA MIGRACIÓN MASIVA


// --- INTERFACES ---
export interface FindAllQueryParams {
    // CAMBIADO: Reemplazamos 'page' por 'skip' (offset) para alinearnos con el backend
    skip: number; // El valor del OFFSET que se envía.
    limit: number | 100;
    search?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}

/* export interface PaginatedResponse {
    data: RegistroVotacion[];
    total: number;
    page: number;
    limit: number;
} */
export interface BulkResponse {
    message: string;
    insertedCount: number;
    errorsCount: number;
    // Opcional: Si el backend devuelve detalles de error
    errors?: any[];
}
/* interface BulkResponse {
    message: string;
    insertedCount: number;
    errorsCount: number;
}
 */


export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}
export interface BulkResponse {
    message: string;
    insertedCount: number;
    errorsCount: number;
    errors?: any[];
}
// Interface para la respuesta de verificación (ej. check-code)
export interface CheckExistsResponse {
    exists: boolean;
}

// --- MÉTODOS API ---

export async function fetchRegistroVotacionPaginated(
    // CAMBIADO: Usamos skip en lugar de page
    params: FindAllQueryParams = { skip: 0, limit: 10 }, // Usar skip por defecto 0
): Promise<PaginatedResponse<RegistroVotacion>> {

    const {
        skip = 0, // Usamos skip directamente
        limit = 10, // Usar 10 como límite por defecto (coincide con TablaRegistrosF)
        search,
        status,
        sortBy,
        sortOrder,
    } = params;

    // ELIMINADA: const skipValue = (page - 1) * limit;

    try {
        const response: AxiosResponse<PaginatedResponse<RegistroVotacion>> = await axios.get(
            API_REG_VOTACION_ENDPOINT,
            {
                params: {
                    // Pasar los parámetros que el DTO del backend espera
                    skip: skip.toString(), // <--- ENVÍA EL SKIP DIRECTO
                    limit: limit.toString(),   // El límite de registros
                    search: search,
                    status: status,
                    sortBy: sortBy,
                    sortOrder: sortOrder,
                    // Ya no enviamos 'page' ya que hemos calculado 'skip'
                },
            },
        );

        return response.data;
    } catch (error) {

        // 1. Manejo específico para errores de Axios
        if (axios.isAxiosError(error)) {
            console.error(
                'Error al obtener Registros:',
                error.response?.data || error.message,
            );
            // Relanzamos un error basado en el mensaje o estado de Axios
            throw new Error(
                `Fallo la petición: ${error.response?.statusText || error.message}`,
            );
        }

        // 2. Manejo genérico para otros tipos de errores (ej. errores de programación)
        if (error instanceof Error) {
            console.error('Error desconocido:', error.message);
            throw new Error(`Error en la aplicación: ${error.message}`);
        }

        // 3. Si no es un error de Axios ni un Error estándar, se maneja como 'unknown'
        console.error('Error completamente desconocido o no tipado:', error);
        throw new Error('Error desconocido al comunicarse con la API.');
    }
}
export async function fetchRegistroVotacionByCedula(cedula: number): Promise<RegistroVotacion> {
    try {
        const response = await axios.get(`${API_REG_VOTACION_ENDPOINT}/${cedula}`);
        return response.data;
    } catch (error) {
        handleAxiosError(error, 'Obtener RegistroVotacion por Cédula');
        throw error;
    }
}
export async function createRegistroVotacion(data: RegistroVotacion): Promise<RegistroVotacion> {
    try {
        const response = await axios.post(API_REG_VOTACION_ENDPOINT, data);
        return response.data;
    } catch (error) {
        handleAxiosError(error, 'Crear RegistroVotacion de Comisión');
    }
}
/**
 * Realiza una petición POST al endpoint de inserción masiva.
 * * @param data Array de objetos (registros) a migrar.
 * @returns Una promesa que resuelve con el resumen de la migración (BulkResponse).
 */

const API_REG_VOTACION_ENDPOINT_MIGRACION = API_REG_VOTACION_ENDPOINT + "/migracion-masiva";
export async function bulkInsertRegistroVotacion(
    data: Partial<RegistroVotacion>[] // Usamos Partial porque los datos del CSV pueden no ser completos/finales
): Promise<BulkResponse> {

    // El backend de NestJS espera un cuerpo con la propiedad 'records' (BulkInsertDto)
    const payload = {
        records: data,
    };

    try {
        const response: AxiosResponse<BulkResponse> = await axios.post(
            API_REG_VOTACION_ENDPOINT_MIGRACION,
            payload, // Enviamos el objeto con la clave 'records'
        );

        return response.data;
    } catch (error) {
        handleAxiosError(error, 'Migración Masiva de Funcionarios');
        // `handleAxiosError` siempre lanza, por lo que esta línea es redundante pero requerida por TS.
        throw error;
    }
}

function handleAxiosError(error: unknown, context: string): never {
    if (axios.isAxiosError(error)) {
        console.error(`${context}:`, error.response?.data || error.message);
        throw new Error(error.response?.data?.message || `Fallo en ${context}: ${error.message}`);
    }
    if (error instanceof Error) {
        console.error(`${context} (Genérico):`, error.message);
        throw new Error(error.message);
    }
    throw new Error(`Error desconocido en ${context}`);
}
/* RegistroVotacion */

/* Ciudades */
export async function getAllCiudades(): Promise<Ciudad[]> {
    try {
        const responseCiu: AxiosResponse<Ciudad[]> = await axios.get(`http://${BASE_URL_SERVER_API}:3000/api/v1/ciudades`);
        return responseCiu.data;
    } catch (error) {
        console.error("Error al obtener ciudades:", error);
        return [];
    }
}

/* Ciudades */

/* Departamentos */
export async function getAllDepartamentos(): Promise<Departamento[]> {
    try {
        const responseDep: AxiosResponse<Departamento[]> = await axios.get(`http://${BASE_URL_SERVER_API}:3000/api/v1/departamentos`);
        return responseDep.data;
    } catch (error) {
        console.error("Error al obtener departamentos:", error);
        return [];
    }
}

/* Departamentos */