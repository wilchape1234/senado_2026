
import { Type } from 'class-transformer';
import { ValidateNested, IsArray, IsNotEmpty, IsNumber, IsString, IsOptional, IsDateString, IsDate } from 'class-validator';


/**

 */
export class RegistroVotacionRecordDto {

    @IsNotEmpty()
    @IsNumber() 
    cedula: number;

    @IsOptional()
    @IsString()
    nombres?: string

    @IsOptional()
    @IsString()
    apellidos?: string


    @IsOptional()
    @IsString()
    correoElectronico?: string

    @IsOptional()
    @IsString()
    numeroCelular?: string

    @IsOptional()
    @IsNumber()
    mesaVotacion?: number

    @IsOptional()
    @IsString()
    lugarVotacion?: string

    @IsOptional()
    @IsNumber()
    municipioId?: number

    @IsOptional()
    @IsString()
    direccion?: string

    @IsOptional()
    @IsString()
    comunaBarrio?: string

    @IsOptional()
    @IsNumber()
    liderCedula?: number

    @IsOptional()
    @IsDate()
    fechaRegistro?: Date | null

    @IsOptional()
    @IsString()
    observacion?: string

}

export class BulkInsertDto {
    @IsArray()
    @IsNotEmpty()
    @ValidateNested({ each: true }) // Valida cada elemento del array usando el DTO anidado
    @Type(() => RegistroVotacionRecordDto)
    records: RegistroVotacionRecordDto[];
}