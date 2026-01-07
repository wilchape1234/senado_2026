
export class CreateRegistroVotacionDto {
    cedula: number;
    nombres: string | null;
    apellidos: string | null;
    correoElectronico: string | null;
    numeroCelular: string | null;
    mesaVotacion: number | null;
    lugarVotacion: string | null;
    departamentoId: number | null;
    municipioId: number | null;
    municipioDepartamento: string | null;
    direccion: string | null;
    comunaBarrio: string | null;
    liderCedula: number | null;
    liderNombres: string | null;
    fechaRegistro: Date | null;
    observacion: string | null;
    revisadoVerificado: boolean | null;
    testigo: boolean | null;
    jurado: boolean | null;
    lider: boolean | null;
}
