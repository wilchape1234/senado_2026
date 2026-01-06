import { fechaHoy } from "src/utils/consts/global";
import { Column, Entity, PrimaryColumn } from "typeorm";



@Entity('registro_votacion')
export class RegistroVotacion {

    // Clave Primaria - Usando string para mayor flexibilidad
    @PrimaryColumn({ type: 'bigint', name: 'cedula', nullable: false })
    cedula: number;

    @Column({ type: 'text', name: 'nombres', nullable: true })
    nombres: string | null;

    @Column({ type: 'text', name: 'apellidos', nullable: true })
    apellidos: string | null;

    @Column({
        type: 'varchar',
        length: 512, // Agrega una longitud
        name: 'correo_electronico',
        nullable: true,
        // unique: true
    })
    correoElectronico: string | null;

    @Column({ type: 'text', name: 'numero_celular', nullable: true })
    numeroCelular: string | null;

    @Column({ type: 'int', name: 'mesa_votacion', nullable: true })
    mesaVotacion: number | null;

    @Column({ type: 'text', name: 'lugar_votacion', nullable: true })
    lugarVotacion: string | null;

    @Column({ type: 'int', name: 'departamento_id', nullable: true })
    departamentoId: number | null;

    @Column({ type: 'int', name: 'municipio_id', nullable: true })
    municipioId: number | null;

    @Column({ type: 'text', name: 'municipio_departamento', nullable: true })
    municipioDepartamento: string | null;

    @Column({ type: 'text', name: 'direccion', nullable: true })
    direccion: string | null;

    @Column({ type: 'text', name: 'comuna_barrio', nullable: true })
    comunaBarrio: string | null;

    @Column({ type: 'bigint', name: 'lider_cedula', nullable: true })
    liderCedula: number | null;

    @Column({ type: 'text', name: 'lider_nombres', nullable: true })
    liderNombres: string | null;

    @Column({ type: 'timestamp', name: 'fecha_registro', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
    fechaRegistro: Date | null;

    @Column({ type: 'text', name: 'observacion', nullable: true })
    observacion: string | null;

    @Column({ type: 'boolean', name: 'revisado_verificado', nullable: true })
    revisadoVerificado: boolean | null;

    @Column({ type: 'boolean', name: 'testigo', nullable: true, default: false })
    testigo: boolean | null;

    @Column({ type: 'boolean', name: 'jurado', nullable: true, default: false })
    jurado: boolean | null;

    @Column({ type: 'boolean', name: 'lider', nullable: true, default: false })
    lider: boolean | null;

}
