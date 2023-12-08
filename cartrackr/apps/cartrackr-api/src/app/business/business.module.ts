import { Module } from '@nestjs/common';
import { BusinessService } from './business.service';
import { BusinessController } from './business.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Business } from './entities/business.entity';
import { ContactInfo } from './entities/contact-info.entity';
import { Location } from '../location/entity/location.entity';
import { UserBusiness } from '../admin/user-business/entities/user-business.entity';

@Module({
  controllers: [BusinessController],
  imports: [
    TypeOrmModule.forFeature([Business, ContactInfo, Location, UserBusiness]),
  ],
  providers: [BusinessService],
})
export class BusinessModule {}
