export class CreateRegistroVotacionDto {
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
