import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LiderService } from './lider.service';
import { CreateLiderDto } from './dto/create-lider.dto';
import { UpdateLiderDto } from './dto/update-lider.dto';

@Controller('lider')
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.liderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLiderDto: UpdateLiderDto) {
    return this.liderService.update(+id, updateLiderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.liderService.remove(+id);
  }
}
