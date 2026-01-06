import { PartialType } from '@nestjs/mapped-types';
import { CreateJuradoDto } from './create-jurado.dto';

export class UpdateJuradoDto extends PartialType(CreateJuradoDto) {}
