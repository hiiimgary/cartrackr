import { Controller, Get, Post } from '@nestjs/common';

import { CarBrandService } from './car/resources/car-brand/car-brand.service';
import { CarBrand } from '@cartrackr/cartrackr-shared';
import { AppService } from './app.service';
import { firstValueFrom } from 'rxjs';
import { ExpenseCategoryService } from './expense-category/expense-category.service';
import { AlertService } from './alert/alert.service';

@Controller()
export class AppController {
  constructor(
    private readonly carBrandService: CarBrandService,
    private readonly expenseCategoryService: ExpenseCategoryService,
    private readonly alertService: AlertService,
    private readonly appService: AppService
  ) {}

  @Get('init')
  async getData() {
    const carTypes: CarBrand[] = await this.carBrandService.getBrands();
    const expenseCategories = await this.expenseCategoryService.findAll();
    const alertTypes = await this.alertService.findAll();

    return {
      carTypes,
      expenseCategories: expenseCategories.filter(
        (category) => category.slug !== 'service-entry'
      ),
      alertTypes,
      fuelTypes: [
        { id: 1, name: 'Petrol' },
        { id: 2, name: 'Diesel' },
        { id: 3, name: 'Electric' },
        { id: 4, name: 'Hybrid' },
      ],
    };
  }

  @Post('add-brands')
  async deleteBrands() {
    const brands = await firstValueFrom(this.appService.getCarModels());
    return this.carBrandService.createBulk(brands);
  }
}
