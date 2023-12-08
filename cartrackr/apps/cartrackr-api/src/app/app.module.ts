import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './admin/users/users.module';
import { AuthModule } from './admin/auth/auth.module';
import { CarBrandModule } from './car/resources/car-brand/car-brand.module';
import { CarModelModule } from './car/resources/car-model/car-model.module';
import { CarBrand } from './car/resources/car-brand/entities/car-brand.entity';
import { User } from './admin/users/entities/user.entity';
import { BusinessModule } from './business/business.module';
import { UserBusinessModule } from './admin/user-business/user-business.module';
import { UserBusiness } from './admin/user-business/entities/user-business.entity';
import { Business } from './business/entities/business.entity';
import { Location } from './location/entity/location.entity';
import { ContactInfo } from './business/entities/contact-info.entity';
import { AppUserModule } from './app/app-user/app-user.module';
import { AppAuthModule } from './app/app-auth/app-auth.module';
import { AppUser } from './app/app-user/entities/app-user.entity';
import { RefreshToken } from './app/app-user/entities/refresh-token.entity';
import { AppCarModule } from './app/app-car/app-car.module';
import { CarModel } from './car/resources/car-brand/entities/car-model.entity';
import { CarModelCategory } from './car/resources/car-brand/entities/car-model-category';
import { Car } from './car/entities/car.entity';
import { ImageModule } from './image/image.module';
import { Image } from './image/entity/image.entity';
import { AppLoginCredential } from './admin/users/entities/app-login-credential.entity';
import { AlertModule } from './alert/alert.module';
import { AlertType } from './alert/entities/alert-type.entity';
import { ExpenseCategoryModule } from './expense-category/expense-category.module';
import { ExpenseCategory } from './expense-category/entities/expense-category.entity';
import { RefillStationModule } from './refill-station/refill-station.module';
import { RefillStation } from './refill-station/entities/refill-station.entity';
import { Expense } from './car/entities/expense.entity';
import { ServiceEntry } from './car/entities/service-entry.entity';
import { Refill } from './car/entities/refill.entity';
import { Alert } from './car/entities/alert.entity';
import * as firebase from 'firebase-admin';
import * as path from 'path';
import { NotificationToken } from './app/app-user/entities/notification-token.entity';
import { BusinessCar } from './business-car/entities/business-car.entity';
import { BusinessCarModule } from './business-car/business-car.module';
import { LocationModule } from './location/location.module';
import { Deadline } from './car/entities/deadlines.entity';

firebase.initializeApp({
  credential: firebase.credential.cert(
    path.join(__dirname, 'assets/firebase-admin.json')
  ),
});

const ENTITIES = [
  CarBrand,
  CarModel,
  CarModelCategory,
  User,
  UserBusiness,
  Business,
  Location,
  ContactInfo,
  AppUser,
  RefreshToken,
  Car,
  Image,
  AppLoginCredential,
  AlertType,
  Alert,
  ExpenseCategory,
  RefillStation,
  Expense,
  ServiceEntry,
  Refill,
  NotificationToken,
  BusinessCar,
  Deadline,
];

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.local',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT) || 3306,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DB,
      entities: ENTITIES,
      synchronize: process.env.DATABASE_SYNCHRONIZE === '1',
    }),
    HttpModule,
    ImageModule,
    CarBrandModule,
    CarModelModule,
    AppUserModule,
    AppAuthModule,
    AuthModule,
    UsersModule,
    BusinessModule,
    UserBusinessModule,
    AlertModule,
    AuthModule,
    UsersModule,
    BusinessModule,
    UserBusinessModule,
    CarBrandModule,
    CarModelModule,
    AlertModule,
    ExpenseCategoryModule,
    RefillStationModule,
    AppUserModule,
    AppAuthModule,
    AppCarModule,
    AppCarModule,
    AlertModule,
    ExpenseCategoryModule,
    RefillStationModule,
    BusinessCarModule,
    LocationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
