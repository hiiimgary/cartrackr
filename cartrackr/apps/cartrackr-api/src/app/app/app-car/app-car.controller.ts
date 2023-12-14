import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { AppCarService } from './app-car.service';
import { AppJwtAuthGuard } from '../app-auth/guards/app-jwt-auth.guard';
import { CreateCarDto } from './dtos/create-car.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { BufferedFile } from '../../image/models/file.model';
import { IdParams } from '../../utils/models/params';
import { CreateExpense } from './dtos/create-expense.dto';
import { AppCarExpenseService } from './app-car-expense.service';
import { AlertDriverDto } from './dtos/alert-driver.dto';
import { AppCarAlertService } from './app-car-alert.service';
import { NotificationService } from '../../notification/notification.service';
import { BusinessJwtAuthGuard } from '../app-auth/guards/business-jwt-auth.guard';
import { AddCarToBusinessDto } from './dtos/add-to-business.dto';
import { UserBusiness } from '../../admin/user-business/entities/user-business.entity';
import { AppUser } from '../app-user/entities/app-user.entity';
import { ChangeBusinessAccessDto } from './dtos/change-business-access.dto';
import { CreateDeadline } from './dtos/create-deadline.dto';
import { AppCarDeadlineService } from './app-car-deadline.service';

@Controller('cars')
export class AppCarController {
  constructor(
    private readonly appCarService: AppCarService,
    private readonly expenseService: AppCarExpenseService,
    private readonly alertService: AppCarAlertService,
    private readonly deadlineService: AppCarDeadlineService,
    private readonly notificationService: NotificationService
  ) {}

  @Post('create')
  @UseGuards(AppJwtAuthGuard)
  @UseInterceptors(FilesInterceptor('images[]'))
  async createCar(
    @Request() req,
    @Body(new ValidationPipe()) car: CreateCarDto,
    @UploadedFiles() files: Array<BufferedFile>
  ) {
    return this.appCarService.createCar(car, files, req.user.id);
  }

  @Post('alert-driver')
  @UseGuards(AppJwtAuthGuard)
  async alertDriver(@Request() req, @Body() alertDriver: AlertDriverDto) {
    const car = await this.appCarService.findCarByLicensePlate(
      alertDriver.licensePlate
    );

    const message = await this.alertService.alertDriver(
      car,
      alertDriver.reason,
      alertDriver.licensePlate
    );

    if (message && car) {
      this.notificationService.sendPushNotification(
        car.owner.fcmTokens.map((token) => token.token),
        {
          data: {
            carId: `${car.id}`,
            type: 'alert',
          },
          notification: {
            title: `Alert for ${car.licensePlate}`,
            body: message,
          },
        }
      );
    }
  }

  @Post('add-to-business')
  @UseGuards(BusinessJwtAuthGuard)
  async addToBusiness(
    @Request() req: { user: UserBusiness },
    @Body(new ValidationPipe()) car: AddCarToBusinessDto
  ) {
    const addedCar = await this.appCarService.addCarToBusiness(
      car.token,
      req.user.business
    );

    this.notificationService.sendPushNotification(
      addedCar.owner.fcmTokens.map((token) => token.token),
      {
        data: {
          carId: `${addedCar.id}`,
          type: 'added_to_business',
        },
        notification: {
          title: `${req.user.business.name} requested access to your car`,
          body: `Click here to accept or reject the request`,
        },
      }
    );
  }

  @Post('change-business-access')
  @UseGuards(AppJwtAuthGuard)
  async changeBusinessAccess(
    @Request() req: { user: AppUser },
    @Body(new ValidationPipe()) payload: ChangeBusinessAccessDto
  ) {
    return this.appCarService.changeBusinessAccess(
      req.user.id,
      payload.businessCarId,
      payload.allowAccess
    );
  }

  @Delete(':id')
  @UseGuards(AppJwtAuthGuard)
  async deleteCar(@Request() req, @Param() params: IdParams) {
    return this.appCarService.deleteCar(params.id, req.user.id);
  }

  @Get(':id')
  @UseGuards(AppJwtAuthGuard)
  getCarDetail(@Request() req, @Param() params: IdParams) {
    return this.appCarService.findCarDetail(req.user.id, params.id);
  }

  @Post(':id/expenses/create')
  @UseGuards(AppJwtAuthGuard)
  async createExpense(
    @Request() req,
    @Param() params: IdParams,
    @Body(new ValidationPipe()) expense: CreateExpense
  ) {
    const car = await this.appCarService.findCarByUser(req.user.id, params.id);

    if (!car) {
      throw new NotFoundException('car_not_found');
    }

    return this.expenseService.createExpense(car, expense);
  }

  @Delete(':id/expenses/:expenseId')
  @UseGuards(AppJwtAuthGuard)
  async deleteExpense(
    @Request() req,
    @Param('id') carId: string,
    @Param('expenseId') expenseId: string
  ) {
    const car = await this.appCarService.findCarByUser(req.user.id, +carId);

    if (!car) {
      throw new NotFoundException('car_not_found');
    }

    return this.expenseService.deleteExpense(+expenseId);
  }

  @Post(':id/deadlines/create')
  @UseGuards(AppJwtAuthGuard)
  async createDeadline(
    @Request() req,
    @Param() params: IdParams,
    @Body(new ValidationPipe()) deadline: CreateDeadline
  ) {
    const car = await this.appCarService.findCarByUser(req.user.id, params.id);

    if (!car) {
      throw new NotFoundException('car_not_found');
    }

    return this.deadlineService.createDeadline(car, deadline);
  }

  @Delete(':id/deadlines/:deadlineId')
  @UseGuards(AppJwtAuthGuard)
  async deleteDeadline(
    @Request() req,
    @Param('id') carId: string,
    @Param('deadlineId') deadlineId: string
  ) {
    const car = await this.appCarService.findCarByUser(req.user.id, +carId);

    if (!car) {
      throw new NotFoundException('car_not_found');
    }

    return this.deadlineService.deleteDeadline(+deadlineId);
  }

  @Post(':id/deadlines/:deadlineId/mark-done')
  @UseGuards(AppJwtAuthGuard)
  async markDeadlineDone(
    @Request() req,
    @Param('id') carId: string,
    @Param('deadlineId') deadlineId: string
  ) {
    const car = await this.appCarService.findCarByUser(req.user.id, +carId);

    if (!car) {
      throw new NotFoundException('car_not_found');
    }

    return this.deadlineService.markDone(car.id, +deadlineId);
  }

  @Post(':id/alerts/:alertId/resolve')
  @UseGuards(AppJwtAuthGuard)
  async resolveAlert(
    @Request() req,
    @Param('id') carId: string,
    @Param('alertId') alertId: string
  ) {
    const car = await this.appCarService.findCarByUser(req.user.id, +carId);

    if (!car) {
      throw new NotFoundException('car_not_found');
    }

    return this.alertService.resolveAlert(car.id, +alertId);
  }

  @Post(':id/alerts/:alertId/archive')
  @UseGuards(AppJwtAuthGuard)
  async archiveAlert(
    @Request() req,
    @Param('id') carId: string,
    @Param('alertId') alertId: string
  ) {
    const car = await this.appCarService.findCarByUser(req.user.id, +carId);

    if (!car) {
      throw new NotFoundException('car_not_found');
    }

    return this.alertService.archiveAlert(car.id, +alertId);
  }
}
