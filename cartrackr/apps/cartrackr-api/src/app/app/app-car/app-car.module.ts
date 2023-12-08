import { Module } from '@nestjs/common';
import { AppCarService } from './app-car.service';
import { AppCarController } from './app-car.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from '../../car/entities/car.entity';
import { CarModel } from '../../car/resources/car-brand/entities/car-model.entity';
import { CarBrand } from '../../car/resources/car-brand/entities/car-brand.entity';
import { CarModelCategory } from '../../car/resources/car-brand/entities/car-model-category';
import { ImageModule } from '../../image/image.module';
import { Expense } from '../../car/entities/expense.entity';
import { ExpenseCategory } from '../../expense-category/entities/expense-category.entity';
import { Refill } from '../../car/entities/refill.entity';
import { ServiceEntry } from '../../car/entities/service-entry.entity';
import { AppCarExpenseService } from './app-car-expense.service';
import { AppCarAlertService } from './app-car-alert.service';
import { AlertType } from '../../alert/entities/alert-type.entity';
import { Alert } from '../../car/entities/alert.entity';
import { NotificationModule } from '../../notification/notification.module';
import { BusinessCar } from '../../business-car/entities/business-car.entity';
import { UserBusiness } from '../../admin/user-business/entities/user-business.entity';
import { Deadline } from '../../car/entities/deadlines.entity';
import { AppCarDeadlineService } from './app-car-deadline.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Car,
      CarModel,
      CarBrand,
      CarModelCategory,
      Expense,
      ExpenseCategory,
      Refill,
      ServiceEntry,
      AlertType,
      Alert,
      BusinessCar,
      ServiceEntry,
      UserBusiness,
      Deadline,
    ]),
    ImageModule,
    NotificationModule,
  ],
  controllers: [AppCarController],
  providers: [
    AppCarService,
    AppCarExpenseService,
    AppCarAlertService,
    AppCarDeadlineService,
  ],
  exports: [AppCarService, AppCarExpenseService],
})
export class AppCarModule {}
