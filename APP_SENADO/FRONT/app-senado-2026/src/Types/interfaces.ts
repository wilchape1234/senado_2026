// interfaces.ts
// export interface Departamento {
//   code: number;
//   departamento: string;
// }

import { hoyFecha } from "../Functions/global";

export interface Municipio {
  codigo_departamento: number;
  codigo_municipio: number;
  nombre_municipio: string;
}
export interface Ciudad {
  id: number;
  name: string | null;
  description: string | null;
  surface: number | null;
  population: number | null;
  postalCode: string | null;
  departmentId: number;
}
export interface DataDepartamentos {
  departamentos: Departamento[];
}

export interface DataMunicipios {
  municipios: Municipio[];
}



export interface Departamento {
  id: number;
  name: string;
  description: string | null;
  cityCapitalId: number | null;
  municipalities: number | null;
  surface: number | null;
  population: number | null;
  phonePrefix: string | null;
}


export interface RegistroVotacion {
  cedula: number;
  nombres: string | null;
  apellidos: string | null;
  correoElectronico: string | null;
  numeroCelular: string | null;
  mesaVotacion: number | null;
  lugarVotacion: string | null;
  municipioId: number | null;
  direccion: string | null;
  comunaBarrio: string | null;
  liderCedula: number | null;
  fechaRegistro: Date | null;
  observacion: string | null;
}
export const regitroVotacionNulo: RegistroVotacion = {
  cedula: 0,
  nombres: 'null',
  apellidos: 'null',
  correoElectronico: 'null',
  numeroCelular: 'null',
  mesaVotacion: 0,
  lugarVotacion: 'null',
  municipioId: 0,
  direccion: 'null',
  comunaBarrio: 'null',
  liderCedula: 0,
  fechaRegistro: hoyFecha,
  observacion: 'null',
}

export interface Lider {
  cedula: number;
  nombres: string | null;
  apellidos: string | null;
  numeroCelular: string | null;
  municipioId: number | null;
  direccion: string | null;
  mesaVotacion: number | null;
  lugarVotacion: string | null;
}
export const liderNulo: Lider = {
  cedula: 0,
  nombres: 'null',
  apellidos: 'null',
  numeroCelular: 'null',
  municipioId: 0,
  direccion: 'null',
  mesaVotacion: 0,
  lugarVotacion: 'null',
}
