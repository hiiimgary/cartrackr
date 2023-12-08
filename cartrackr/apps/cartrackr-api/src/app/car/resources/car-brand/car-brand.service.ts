import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCarBrandDto } from './dto/create-car-brand.dto';
import { UpdateCarBrandDto } from './dto/update-car-brand.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CarBrand } from './entities/car-brand.entity';
import { Repository } from 'typeorm';
import { CarModelCategory } from './entities/car-model-category';
import { CarModel } from './entities/car-model.entity';
import { CreateCarTypeDto } from './dto/create-type.dto';

@Injectable()
export class CarBrandService {
  constructor(
    @InjectRepository(CarBrand)
    private carBrandRepository: Repository<CarBrand>,
    @InjectRepository(CarModelCategory)
    private carModelCategoryRepository: Repository<CarModelCategory>,
    @InjectRepository(CarModel) private carModelRepository: Repository<CarModel>
  ) {}

  createBulk(brands: CreateCarBrandDto[]) {
    const carBrands = this.carBrandRepository.create(brands);

    return this.carBrandRepository.save(carBrands);
  }

  createBrand(createCarTypeDto: CreateCarTypeDto) {
    const carBrand = this.carBrandRepository.create(createCarTypeDto);

    return this.carBrandRepository.save(carBrand);
  }

  async createCategory(
    createCarModelCategoryDto: CreateCarTypeDto,
    brandId: number
  ) {
    const brand = await this.carBrandRepository.findOneBy({ id: brandId });

    if (!brand) {
      throw new BadRequestException('brand-not-found');
    }

    const carModelCategory = this.carModelCategoryRepository.create({
      ...createCarModelCategoryDto,
      brand,
    });

    return this.carModelCategoryRepository.save(carModelCategory);
  }

  async createModel(createCarTypeDto: CreateCarTypeDto, brandId: number) {
    const brand = await this.carBrandRepository.findOneBy({ id: brandId });

    if (!brand) {
      throw new BadRequestException('brand-not-found');
    }

    const carModel = this.carModelRepository.create({
      ...createCarTypeDto,
      brand,
    });

    return this.carModelRepository.save(carModel);
  }

  async createModelWithCategory(
    createCarTypeDto: CreateCarTypeDto,
    brandId: number,
    categoryId: number
  ) {
    const brand = await this.carBrandRepository.findOneBy({ id: brandId });

    if (!brand) {
      throw new BadRequestException('brand-not-found');
    }

    const category = await this.carModelCategoryRepository.findOneBy({
      id: categoryId,
      brandId,
    });

    if (!category) {
      throw new BadRequestException('category-not-found');
    }

    const carModel = this.carModelRepository.create({
      ...createCarTypeDto,
      category,
    });

    return this.carModelRepository.save(carModel);
  }

  findAll() {
    return this.carBrandRepository.find();
  }

  findOne(id: number) {
    return this.carBrandRepository.findOneBy({ id });
  }

  findCategory(id: number, categoryId: number) {
    return this.carModelCategoryRepository.findOneBy({
      id: categoryId,
      brandId: id,
    });
  }

  findModelWithCategory(id: number, categoryId: number, modelId: number) {
    return this.carModelRepository.findOne({
      where: {
        id: modelId,
        category: {
          id: categoryId,
          brandId: id,
        },
      },
      relations: ['category', 'category.brand'],
    });
  }

  findModel(id: number, modelId: number) {
    return this.carModelRepository.findOne({
      where: {
        id: modelId,
        brand: {
          id,
        },
      },
      relations: ['brand'],
    });
  }

  updateBrand(id: number, updateCarBrandDto: UpdateCarBrandDto) {
    return this.carBrandRepository.update({ id }, updateCarBrandDto);
  }

  updateCategory(
    id: number,
    categoryId: number,
    updateCarBrandDto: UpdateCarBrandDto
  ) {
    return this.carModelCategoryRepository.update(
      { id: categoryId, brandId: id },
      updateCarBrandDto
    );
  }

  updateModel(
    id: number,
    modelId: number,
    updateCarBrandDto: UpdateCarBrandDto
  ) {
    return this.carModelRepository.update(
      { id: modelId, brand: { id } },
      updateCarBrandDto
    );
  }

  updateModelWithCategory(
    id: number,
    categoryId: number,
    modelId: number,
    updateCarBrandDto: UpdateCarBrandDto
  ) {
    return this.carModelRepository.update(
      { id: modelId, category: { id: categoryId, brandId: id } },
      updateCarBrandDto
    );
  }

  removeBrand(id: number) {
    return this.carBrandRepository.delete({ id });
  }

  removeCategory(id: number, categoryId: number) {
    return this.carModelCategoryRepository.delete({
      id: categoryId,
      brandId: id,
    });
  }

  removeModel(id: number, modelId: number) {
    return this.carModelRepository.delete({ id: modelId, brand: { id } });
  }

  removeModelWithCategory(id: number, categoryId: number, modelId: number) {
    return this.carModelRepository.delete({
      id: modelId,
      category: { id: categoryId, brandId: id },
    });
  }

  getBrands(): Promise<CarBrand[]> {
    return this.carBrandRepository.find();
  }
}
