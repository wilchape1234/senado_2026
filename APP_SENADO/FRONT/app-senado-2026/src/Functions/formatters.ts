
/**
 * Convierte una cadena en formato PascalCase (ej. "SamirChala") 
 * a un formato legible con espacios entre palabras (ej. "Samir Chala").
 * @param str La cadena en PascalCase.
 * @returns La cadena con espacios.
 */
export function toPascalCase(str: string | any): string {
    if (typeof str !== 'string' || str.length === 0) {
        return ''; // Manejo básico de entrada no válida
    }

    return str
        .split(' ') // 1. Divide la cadena en un array de palabras (usando el espacio)
        .map(word => { // 2. Itera sobre cada palabra
            if (word.length === 0) return ''; // Ignora si hay espacios dobles
            // 3. Capitaliza la primera letra y pone el resto en minúsculas
            return word[0].toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(' '); // 4. UNE LAS PALABRAS USANDO UN ESPACIO (' ')
}