import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserBusinessService } from './user-business.service';
import { UpdateUserBusinessDto } from './dto/update-business-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { InviteUserBusinessDto } from './dto/invite-business-user.dto';

@Controller('user-businesses')
export class UserBusinessController {
  constructor(private readonly userBusinessService: UserBusinessService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findEmployees(@Req() req) {
    if (!req.user.activeUserBusinessId) {
      throw new BadRequestException('no-active-business');
    }
    const employees = await this.userBusinessService.findEmployees(
      req.user.activeUserBusinessId
    );

    return employees.map((e) => ({
      ...e.user,
      permission: e.permission,
      userBusinessId: e.id,
    }));
  }

  @Post('invite')
  @UseGuards(JwtAuthGuard)
  async invite(@Req() req, @Body() body: InviteUserBusinessDto) {
    if (!req.user.activeUserBusinessId) {
      throw new BadRequestException('no-active-business');
    }

    return this.userBusinessService.invite(
      req.user.activeUserBusinessId,
      body.email,
      body.permission
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Req() req, @Param('id') id: string) {
    if (!req.user.activeUserBusinessId) {
      throw new BadRequestException('no-active-business');
    }

    const employee = await this.userBusinessService.findById(
      req.user.activeUserBusinessId,
      +id,
      ['user']
    );

    return {
      ...employee.user,
      permission: employee.permission,
      userBusinessId: employee.id,
    };
  }

  @Post(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Req() req,
    @Body() updateUserDto: UpdateUserBusinessDto
  ) {
    return this.userBusinessService.update(
      req.user.activeUserBusinessId,
      +id,
      updateUserDto
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userBusinessService.remove(+id);
  }
}
