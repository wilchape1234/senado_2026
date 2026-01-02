export class CreateLiderDto {
    cedula: number;
    nombres: string | null;
    apellidos: string | null;
    numeroCelular: string | null;
    municipioId: string | null;
    direccion: string | null;
    mesaVotacion: number | null;
    lugarVotacion: string | null;
}
