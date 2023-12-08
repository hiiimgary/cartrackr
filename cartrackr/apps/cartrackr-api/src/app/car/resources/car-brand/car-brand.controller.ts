import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { CarBrandService } from './car-brand.service';
import { CreateCarBrandDto } from './dto/create-car-brand.dto';
import { CreateCarTypeDto } from './dto/create-type.dto';
import { UpdateCarTypeDto } from './dto/update-car-type.dto';

@Controller('cars/brands')
export class CarBrandController {
  constructor(private readonly carBrandService: CarBrandService) {}

  @Post('create-bulk')
  bulkCreate(@Body() createCarBrandDto: CreateCarBrandDto[]) {
    return this.carBrandService.createBulk(createCarBrandDto);
  }

  @Post()
  createBrand(@Body() createCarTypeDto: CreateCarTypeDto) {
    return this.carBrandService.createBrand(createCarTypeDto);
  }

  @Post(':id/categories/create')
  createCategory(
    @Body() createCarTypeDto: CreateCarTypeDto,
    @Param('id') id: string
  ) {
    return this.carBrandService.createCategory(createCarTypeDto, +id);
  }

  @Post(':id/models/create')
  createModel(
    @Body() createCarTypeDto: CreateCarTypeDto,
    @Param('id') id: string
  ) {
    return this.carBrandService.createModel(createCarTypeDto, +id);
  }

  @Post(':id/categories/:categoryId/models/create')
  createModelWithCategory(
    @Body() createCarTypeDto: CreateCarTypeDto,
    @Param('id') id: string,
    @Param('categoryId') categoryId: string
  ) {
    return this.carBrandService.createModelWithCategory(
      createCarTypeDto,
      +id,
      +categoryId
    );
  }

  @Post(':id')
  updateBrand(
    @Param('id') id: string,
    @Body() updateCarTypeDto: UpdateCarTypeDto
  ) {
    return this.carBrandService.updateBrand(+id, updateCarTypeDto);
  }

  @Post(':id/categories/:categoryId')
  updateCategory(
    @Param('id') id: string,
    @Param('categoryId') categoryId: string,
    @Body() updateCarTypeDto: UpdateCarTypeDto
  ) {
    return this.carBrandService.updateCategory(
      +id,
      +categoryId,
      updateCarTypeDto
    );
  }

  @Post(':id/models/:modelId')
  updateModel(
    @Param('id') id: string,
    @Param('modelId') modelId: string,
    @Body() updateCarTypeDto: UpdateCarTypeDto
  ) {
    return this.carBrandService.updateModel(+id, +modelId, updateCarTypeDto);
  }

  @Post(':id/categories/:categoryId/models/:modelId')
  updateModelWithCategory(
    @Param('id') id: string,
    @Param('categoryId') categoryId: string,
    @Param('modelId') modelId: string,
    @Body() updateCarTypeDto: UpdateCarTypeDto
  ) {
    return this.carBrandService.updateModelWithCategory(
      +id,
      +categoryId,
      +modelId,
      updateCarTypeDto
    );
  }

  @Delete(':id')
  deleteBrand(@Param('id') id: string) {
    return this.carBrandService.removeBrand(+id);
  }

  @Delete(':id/categories/:categoryId')
  deleteCategory(
    @Param('id') id: string,
    @Param('categoryId') categoryId: string
  ) {
    return this.carBrandService.removeCategory(+id, +categoryId);
  }

  @Delete(':id/models/:modelId')
  deleteModel(@Param('id') id: string, @Param('modelId') modelId: string) {
    return this.carBrandService.removeModel(+id, +modelId);
  }

  @Delete(':id/categories/:categoryId/models/:modelId')
  deleteModelWithCategory(
    @Param('id') id: string,
    @Param('categoryId') categoryId: string,
    @Param('modelId') modelId: string
  ) {
    return this.carBrandService.removeModelWithCategory(
      +id,
      +categoryId,
      +modelId
    );
  }

  @Get()
  findAll() {
    return this.carBrandService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carBrandService.findOne(+id);
  }

  @Get(':id/categories/:categoryId')
  findCategory(
    @Param('id') id: string,
    @Param('categoryId') categoryId: string
  ) {
    return this.carBrandService.findCategory(+id, +categoryId);
  }

  @Get(':id/categories/:categoryId/models/:modelId')
  findModelWithCategory(
    @Param('id') id: string,
    @Param('categoryId') categoryId: string,
    @Param('modelId') modelId: string
  ) {
    return this.carBrandService.findModelWithCategory(
      +id,
      +categoryId,
      +modelId
    );
  }

  @Get(':id/models/:modelId')
  findModel(@Param('id') id: string, @Param('modelId') modelId: string) {
    return this.carBrandService.findModel(+id, +modelId);
  }
}
