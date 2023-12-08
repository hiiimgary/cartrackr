import { Module } from '@nestjs/common';
import { RefillStationService } from './refill-station.service';
import { RefillStationController } from './refill-station.controller';
import { RefillStation } from './entities/refill-station.entity';
import { Location } from '../location/entity/location.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([RefillStation, Location])],
  controllers: [RefillStationController],
  providers: [RefillStationService],
})
export class RefillStationModule {}
