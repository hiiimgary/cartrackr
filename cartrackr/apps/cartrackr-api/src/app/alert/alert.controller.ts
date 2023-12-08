import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { AlertService } from './alert.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';
import { IdParams } from '../utils/models/params';

@Controller('alerts')
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @Post()
  create(@Body() createAlertDto: CreateAlertDto) {
    return this.alertService.create(createAlertDto);
  }

  @Get()
  findAll() {
    return this.alertService.findAll();
  }

  @Get(':id')
  findOne(@Param() params: IdParams) {
    return this.alertService.findOne(params.id);
  }

  @Post(':id')
  update(@Param() params: IdParams, @Body() updateAlertDto: UpdateAlertDto) {
    return this.alertService.update(params.id, updateAlertDto);
  }

  @Delete(':id')
  remove(@Param() params: IdParams) {
    return this.alertService.remove(params.id);
  }
}
