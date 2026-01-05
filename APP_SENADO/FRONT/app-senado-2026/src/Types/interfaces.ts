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
  departamentoId?: number | null;
  municipioDepartamento?: string | null;
  direccion: string | null;
  comunaBarrio: string | null;
  liderCedula: number | null;
  liderNombres?: string | null;
  fechaRegistro: Date | null;
  observacion: string | null;
  revisado_verificado?: boolean | null;
}
export const regitroVotacionNulo: RegistroVotacion = {
  cedula: 0,
  nombres: '',
  apellidos: '',
  correoElectronico: '',
  numeroCelular: '',
  mesaVotacion: 0,
  lugarVotacion: '',
  municipioId: 0,
  direccion: '',
  comunaBarrio: '',
  liderCedula: 0,
  fechaRegistro: hoyFecha,
  observacion: '',
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
  nombres: '',
  apellidos: '',
  numeroCelular: '',
  municipioId: 0,
  direccion: '',
  mesaVotacion: 0,
  lugarVotacion: '',
}
