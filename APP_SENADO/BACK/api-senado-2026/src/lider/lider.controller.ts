import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LiderService } from './lider.service';
import { CreateLiderDto } from './dto/create-lider.dto';
import { UpdateLiderDto } from './dto/update-lider.dto';

@Controller('api/v1/lider')
export class LiderController {
  constructor(private readonly liderService: LiderService) {}

  @Post()
  create(@Body() createLiderDto: CreateLiderDto) {
    return this.liderService.create(createLiderDto);
  }

  @Get()
  findAll() {
    return this.liderService.findAll();
  }

  @Get(':cedula')
  findOne(@Param('cedula') cedula: string) {
    return this.liderService.findOne(+cedula);
  }

  @Patch(':cedula')
  update(@Param('cedula') cedula: string, @Body() updateLiderDto: UpdateLiderDto) {
    return this.liderService.update(+cedula, updateLiderDto);
  }

  @Delete(':cedula')
  remove(@Param('cedula') cedula: string) {
    return this.liderService.remove(+cedula);
  }
}
