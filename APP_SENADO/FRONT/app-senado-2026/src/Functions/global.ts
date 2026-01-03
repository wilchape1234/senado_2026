import { fetchRegistroVotacionByCedula } from "../API/apiResponse";

export let hoyFecha = new Date()
// NOTA: Eliminamos la interface ValitationMsg y el type SetterValidation originales.

// Nuevo tipo que mapea los nombres de los campos a sus mensajes de error.
// Usamos string para el mensaje de error, y si está vacío, el campo es válido.
export interface ValitationMsg {
    msg: string;
    error: boolean;
}


export interface ValidationErrors {
    cedula: string;
    municipioId: string;
    liderCedula: string;
    mesaVotacion: string;
    departamentoId: string;
    nombres: string;
    apellidos: string;
    numeroCelular: string;
    correoElectronico: string;
    lugarVotacion: string;
    direccion: string;
    comunaBarrio: string;
    observacion: string;
    // Añadir otros campos si es necesario
}

// Inicialización de la estructura de errores
export const initialValidationErrors: ValidationErrors = {
    cedula: '',
    municipioId: '',
    liderCedula: '',
    mesaVotacion: '',
    departamentoId: '',
    nombres: '',
    apellidos: '',
    numeroCelular: '',
    correoElectronico: '',
    lugarVotacion: '',
    direccion: '',
    comunaBarrio: '',
    observacion: '',
};


const validarCedula = async (cedula: number) => {

    let evaluar = await fetchRegistroVotacionByCedula(cedula)

    return (evaluar.cedula as number == cedula)
}
/**
 * Función de validación pura que devuelve el mensaje de error (string).
 * Si el campo es válido, devuelve una cadena vacía ('').
 * @param name El nombre del campo a validar.
 * @param value El valor actual del campo.
 * @returns El mensaje de error o una cadena vacía si es válido.
 */
export const validarRegistro = async (name: keyof ValidationErrors, value: string | number | any): Promise<string> => {
let errorMsg: string = '';
    const strValue = String(value || '').trim();

    switch (name) {
        case ('cedula'):
            // 1. Validación SÍNCRONA (Formato y Longitud)
            if (!Number(value) || strValue.length < 7) {
                errorMsg = 'Debe ser un número y tener al menos 7 dígitos.';
                // Si hay error síncrono, salimos del case
                break; 
            }

            // 2. Validación ASÍNCRONA (Duplicidad) - SOLO se ejecuta si no hay errorMsg
            if (errorMsg === '') {
                try {
                    const existe = await validarCedula(value as number)
                    if (existe) {
                        // Si existe, se establece el error de duplicidad
                        errorMsg = `La persona con cedula ${value} ya está resgitrada`;
                    }
                } catch (error) {
                    // Manejo de error de conexión/API
                    // Si la API falla, es mejor dejar un mensaje de error claro
                    console.error("Error al verificar duplicidad de cédula:", error);
                    // errorMsg = 'Error de sistema al verificar cédula. Intente nuevamente.';
                }
            }
            break;

        case ('municipioId'):
        case ('departamentoId'):
            // Para Selects/IDs, aseguramos que se haya seleccionado un valor numérico > 0
            if (!Number(value) || value === 0) {
                errorMsg = 'Debe seleccionar un valor.';
            }
            break;

        case ('liderCedula'):
        case ('mesaVotacion'):
            if (!Number(value)) {
                errorMsg = 'Debe ser un valor numérico.';
            }
            break;

        case ('nombres'):
        case ('apellidos'):
        case ('lugarVotacion'):
        case ('direccion'):
        case ('comunaBarrio'):
            // case ('observacion'):
            // Tu lógica requiere que se permitan espacios internos (ej: 'Eduar Samir'),
            // por lo que solo verificamos que no esté vacío después de .trim().
            if (!strValue) {
                errorMsg = 'Este campo es obligatorio.';
            }
            break;

        case ('numeroCelular'):
            if (!Number(value) || strValue.length < 7) {
                errorMsg = 'Debe ser un número válido (mínimo 7 dígitos).';
            }
            break;

        case ('correoElectronico'):
            // Validación básica: debe contener '@' y '.' y no estar vacío.
            if (!strValue || !(strValue.includes('@') && strValue.includes('.'))) {
                errorMsg = 'Ingrese un formato de correo válido (ej: usuario@dominio.com).';
            }
            break;

        default:
            break;
    }

    return errorMsg;
};