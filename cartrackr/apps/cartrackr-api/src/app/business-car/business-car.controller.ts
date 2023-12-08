import {
  Controller,
  Get,
  Param,
  UseGuards,
  Req,
  Post,
  Body,
  ValidationPipe,
  Delete,
} from '@nestjs/common';
import { BusinessCarService } from './business-car.service';
import { JwtAuthGuard } from '../admin/auth/guards/jwt-auth.guard';
import { User } from '../admin/users/entities/user.entity';
import { CreateServiceEntryDto } from './dto/create-service-entry.dto';
import { NofityOwnerDto } from './dto/notify-owner.dto';

@Controller('business-cars')
@UseGuards(JwtAuthGuard)
export class BusinessCarController {
  constructor(private readonly businessCarService: BusinessCarService) {}

  @Get()
  findAll(@Req() req: { user: User & { activeUserBusinessId: number } }) {
    return this.businessCarService.findAllByUserBusiness(
      req.user.activeUserBusinessId
    );
  }

  @Get(':id')
  findOne(
    @Req() req: { user: User & { activeUserBusinessId: number } },
    @Param('id') businessCarId: string
  ) {
    return this.businessCarService.findOne(
      +businessCarId,
      req.user.activeUserBusinessId
    );
  }

  @Post(':id')
  update(
    @Param('id') expenseId: string,
    @Req() req: { user: User & { activeUserBusinessId: number } },
    @Body(new ValidationPipe()) updateBusinessCarDto: CreateServiceEntryDto
  ) {
    return this.businessCarService.update(
      updateBusinessCarDto,
      +expenseId,
      req.user.activeUserBusinessId
    );
  }

  @Post(':id/notify')
  notifyOwner(
    @Param('id') businessCarId: string,
    @Body(new ValidationPipe()) notifyDto: NofityOwnerDto
  ) {
    return this.businessCarService.notifyOwner(+businessCarId, notifyDto.title);
  }

  @Delete(':id')
  remove(@Param('id') businessCarId: string) {
    return this.businessCarService.remove(+businessCarId);
  }
}
