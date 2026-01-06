// En src/user/entities/user.entity.ts

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('user')
export class User {

    @PrimaryGeneratedColumn({ name: 'user_id', type: 'int' })
    userId: number;

    // Cambiar a varchar con longitud 255
    @Column({ name: 'rol_id', type: 'int', unique: false, nullable: true })
    rolId: number | null;

    // Columna problemática: Cambiar 'text' por 'varchar' y añadir length
    @Column({ name: 'user_name', type: 'varchar', length: 255, unique: true, nullable: false })
    userName: string ;

    // Columna problemática: Cambiar 'text' por 'varchar' y añadir length
    @Column({ name: 'email', type: 'varchar', length: 255, unique: true, nullable: false })
    email: string ;

    // Contraseña (hash de bcrypt): Cambiar 'text' por 'varchar' y añadir length
    // 255 es más que suficiente para un hash de bcrypt (generalmente < 72 caracteres)
    @Column({ name: 'password', type: 'varchar', length: 255, unique: true, nullable: false  })
    password: string ;
}