import { PartialType } from '@nestjs/mapped-types';
import { CreateLiderDto } from './create-lider.dto';

export class UpdateLiderDto extends PartialType(CreateLiderDto) {}
