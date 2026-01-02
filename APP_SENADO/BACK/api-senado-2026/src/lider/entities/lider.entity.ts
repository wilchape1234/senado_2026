import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('lider')
export class Lider {

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

    @Column({ type: 'text', name: 'municipio_id', nullable: true })
    municipioId: string | null;

    @Column({ type: 'text', name: 'direccion', nullable: true })
    direccion: string | null;

    @Column({ type: 'int', name: 'mesa_votacion', nullable: true })
    mesaVotacion: number | null;

    @Column({ type: 'text', name: 'lugar_votacion', nullable: true })
    lugarVotacion: string | null;

}
