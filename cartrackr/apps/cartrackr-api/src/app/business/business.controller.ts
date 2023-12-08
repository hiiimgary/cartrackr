import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BusinessService } from './business.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { JwtAuthGuard } from '../admin/auth/guards/jwt-auth.guard';

@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Req() req,
    @Body(new ValidationPipe()) createBusinessDto: CreateBusinessDto
  ) {
    return this.businessService.create(createBusinessDto, req.user.id);
  }

  @Get()
  findAll() {
    return this.businessService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.businessService.findOne(+id);
  }

  @Post(':id')
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateBusinessDto: UpdateBusinessDto
  ) {
    return this.businessService.update(+id, updateBusinessDto);
  }

  @Post(':id/activate')
  activate(@Param('id') id: string) {
    return this.businessService.activate(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.businessService.remove(+id);
  }
}
