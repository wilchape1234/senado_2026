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


export const validarCedula = async (cedula: number) => {

    let evaluar = await fetchRegistroVotacionByCedula(cedula)

    return (evaluar.cedula as number == cedula)
}
/**
 * Función de validación pura que devuelve el mensaje de error (string).
 * Si el campo es válido, devuelve una cadena vacía ('').
 * @param name El nombre del campo a validar.
 * @param value El valor actual del campo.
 * @param isEditing Indica si el formulario está en modo edición.
 * @param originalCedula La cédula original del registro (solo en modo edición).
 * @returns El mensaje de error o una cadena vacía si es válido.
 */
export const validarRegistro = async (
    name: keyof ValidationErrors,
    value: string | number | any,
    isEditing: boolean = false, // <- NUEVO: Agregar parámetro con valor por defecto
    originalCedula: number | null = null // <- NUEVO: Cédula original
): Promise<string> => {
    let errorMsg: string = '';
    const strValue = String(value || '').trim();

    switch (name) {
        case ('cedula'):
            // 1. Validación SÍNCRONA (Formato y Longitud)
            if (!Number(value) || strValue.length < 7) {
                errorMsg = 'Debe ser un número y tener al menos 7 dígitos.';
                break;
            }

            // Si la cédula es numéricamente válida...

            // Lógica de Edición: Si es modo edición Y la cédula no ha cambiado, no verificar duplicidad.
            if (isEditing && originalCedula === Number(value)) {
                // No hay error. Salir del case 'cedula'.

                break;
            }

            // Lógica de Creación o Cédula Modificada en Edición:
            try {
                const existe = await validarCedula(value as number)
                if (existe && !isEditing) {
                    errorMsg = `La persona con cedula ${value} ya está registrada`;
                }
            } catch (error) {
                // Si la API falla al verificar (ej. 500), puedes establecer un error de conexión
                console.error("Error al verificar duplicidad de cédula:", error);
                // errorMsg = 'Error de conexión al verificar cédula. Intente de nuevo.';
            }
            break;

        // ... (Resto de tu lógica de validación)

        case ('departamentoId'):
            if (!Number(value)) {
                errorMsg = 'Seleccione por favor el departamento.';
            }

            break;
        case ('municipioId'):
            if (!Number(value)) {
                errorMsg = 'Seleccione por favor el Municipio o Ciudad.';
            }

            break;
        case ('nombres'):
        case ('apellidos'):
            if (!strValue) {
                errorMsg = 'Este campo es obligatorio.';
            }
            break;

        case ('numeroCelular'):
            if (!Number(value) || strValue.length < 7) {
                errorMsg = 'Debe ser un número válido (mínimo 7 dígitos).';
            }
            break;

        default:
            break;
    }

    return errorMsg;
};

const customBlue900 = '#1e3a8a';

export { customBlue900 }