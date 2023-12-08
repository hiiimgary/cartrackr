import { Module } from '@nestjs/common';
import { CarBrandService } from './car-brand.service';
import { CarBrandController } from './car-brand.controller';
import { CarBrand } from './entities/car-brand.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarModel } from './entities/car-model.entity';
import { CarModelCategory } from './entities/car-model-category';

@Module({
  imports: [TypeOrmModule.forFeature([CarBrand, CarModel, CarModelCategory])],
  controllers: [CarBrandController],
  providers: [CarBrandService],
  exports: [CarBrandService],
})
export class CarBrandModule {}
