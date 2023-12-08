import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RefillStationService } from './refill-station.service';
import { CreateRefillStationDto } from './dto/create-refill-station.dto';
import { UpdateRefillStationDto } from './dto/update-refill-station.dto';

@Controller('refill-stations')
export class RefillStationController {
  constructor(private readonly refillStationService: RefillStationService) {}

  @Post()
  create(@Body() createRefillStationDto: CreateRefillStationDto) {
    return this.refillStationService.create(createRefillStationDto);
  }

  @Get()
  findAll() {
    return this.refillStationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.refillStationService.findOne(+id);
  }

  @Post(':id')
  update(
    @Param('id') id: string,
    @Body() updateRefillStationDto: UpdateRefillStationDto
  ) {
    return this.refillStationService.update(+id, updateRefillStationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.refillStationService.remove(+id);
  }
}
