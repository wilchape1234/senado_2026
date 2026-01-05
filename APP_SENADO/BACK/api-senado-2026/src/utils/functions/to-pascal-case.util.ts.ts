// src/utils/to-pascal-case.util.ts

/**
 * Convierte una cadena a formato PascalCase (o Title Case), asegurando
 * que cada palabra comience con mayúscula y el resto sea minúscula.
 *
 * Ejemplo: "JUAN perez gOMEZ" -> "Juan Perez Gomez"
 *
 * @param str La cadena de texto a transformar.
 * @returns La cadena en formato PascalCase.
 */
export function toPascalCase(str: string | null | undefined): string | null {
  if (!str) {
    return null;
  }

  // 1. Convertir a minúsculas
  const lowerCaseStr = str.toLowerCase();

  // 2. Reemplazar para convertir la primera letra de cada palabra a mayúscula
  return lowerCaseStr.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
  });
}