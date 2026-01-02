import { PartialType } from '@nestjs/mapped-types';
import { CreateRegistroVotacionDto } from './create-registro_votacion.dto';

export class UpdateRegistroVotacionDto extends PartialType(CreateRegistroVotacionDto) {}
