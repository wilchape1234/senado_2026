// interfaces.ts
export interface Departamento {
  code: number;
  departamento: string;
}

export interface Municipio {
  codigo_departamento: number;
  codigo_municipio: number;
  nombre_municipio: string;
}

export interface DataDepartamentos {
  departamentos: Departamento[];
}

export interface DataMunicipios {
  municipios: Municipio[];
}
