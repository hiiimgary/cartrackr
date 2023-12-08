import { Module } from '@nestjs/common';
import { UserBusinessService } from './user-business.service';
import { UserBusinessController } from './user-business.controller';
import { UserBusiness } from './entities/user-business.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';

@Module({
  controllers: [UserBusinessController],
  imports: [TypeOrmModule.forFeature([UserBusiness, User])],
  providers: [UserBusinessService],
  exports: [UserBusinessService],
})
export class UserBusinessModule {}
