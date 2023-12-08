import { Module } from '@nestjs/common';
import { BusinessCarService } from './business-car.service';
import { BusinessCarController } from './business-car.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessCar } from './entities/business-car.entity';
import { Car } from '../car/entities/car.entity';
import { UserBusiness } from '../admin/user-business/entities/user-business.entity';
import { ImageModule } from '../image/image.module';
import { AppCarModule } from '../app/app-car/app-car.module';
import { Expense } from '../car/entities/expense.entity';
import { ServiceEntry } from '../car/entities/service-entry.entity';
import { Business } from '../business/entities/business.entity';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BusinessCar,
      Car,
      UserBusiness,
      Expense,
      ServiceEntry,
      Business,
    ]),
    ImageModule,
    AppCarModule,
    NotificationModule,
  ],
  controllers: [BusinessCarController],
  providers: [BusinessCarService],
})
export class BusinessCarModule {}
