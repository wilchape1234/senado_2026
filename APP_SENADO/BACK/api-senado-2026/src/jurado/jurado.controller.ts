import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { JuradoService } from './jurado.service';
import { CreateJuradoDto } from './dto/create-jurado.dto';
import { UpdateJuradoDto } from './dto/update-jurado.dto';

@Controller('api/v1/jurado')
export class JuradoController {
  constructor(private readonly juradoService: JuradoService) {}

  @Post()
  create(@Body() createJuradoDto: CreateJuradoDto) {
    return this.juradoService.create(createJuradoDto);
  }

  @Get()
  findAll() {
    return this.juradoService.findAll();
  }

  @Get(':cedula')
  findOne(@Param('cedula') cedula: string) {
    return this.juradoService.findOne(+cedula);
  }

  @Patch(':cedula')
  update(@Param('cedula') cedula: string, @Body() updateJuradoDto: UpdateJuradoDto) {
    return this.juradoService.update(+cedula, updateJuradoDto);
  }

  @Delete(':cedula')
  remove(@Param('cedula') id: string) {
    return this.juradoService.remove(+id);
  }
}
