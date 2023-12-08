import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Car } from '../../car/entities/car.entity';
import { Repository } from 'typeorm';
import { CreateCarDto } from './dtos/create-car.dto';
import { CarModel } from '../../car/resources/car-brand/entities/car-model.entity';
import { CarResponseDto } from './dtos/car-response.dto';
import { CarModelCategory } from '../../car/resources/car-brand/entities/car-model-category';
import { BufferedFile } from '../../image/models/file.model';
import { ImageService } from '../../image/image.service';
import { AppCarExpenseService } from './app-car-expense.service';
import { randomBytes } from 'crypto';
import { Business } from '../../business/entities/business.entity';
import { BusinessCar } from '../../business-car/entities/business-car.entity';
import { CarResponse } from '@cartrackr/cartrackr-shared';

@Injectable()
export class AppCarService {
  constructor(
    @InjectRepository(Car)
    private readonly carsRepository: Repository<Car>,
    @InjectRepository(CarModel)
    private readonly carModelsRepository: Repository<CarModel>,
    @InjectRepository(CarModelCategory)
    private readonly carModelCategoryRepository: Repository<CarModelCategory>,
    @InjectRepository(BusinessCar)
    private readonly businessCarRepository: Repository<BusinessCar>,
    private readonly imageService: ImageService,
    private readonly expenseService: AppCarExpenseService
  ) {}

  async findCarsByUserId(userId: number): Promise<CarResponseDto[]> {
    const cars = await this.carsRepository
      .createQueryBuilder('car')
      .leftJoinAndSelect('car.model', 'model')
      .leftJoinAndSelect('car.images', 'images')
      .leftJoinAndSelect('model.category', 'category')
      .leftJoinAndSelect('category.brand', 'brand')
      .leftJoinAndSelect('model.brand', 'modelBrand')
      .leftJoinAndSelect(
        'car.expenses',
        'expense',
        'expense.isFinalized = true'
      )
      .leftJoinAndSelect('car.deadlines', 'deadline')
      .leftJoinAndSelect('car.businesses', 'businessCar')
      .leftJoinAndSelect('businessCar.business', 'business')
      .leftJoinAndSelect('car.alerts', 'alert', 'alert.isArchived = false')
      .leftJoinAndSelect('alert.alertType', 'alertType')
      .leftJoinAndSelect('expense.expenseCategory', 'expenseCategory')
      .leftJoinAndSelect('expense.refill', 'expenseRefill')
      .leftJoinAndSelect('expense.serviceEntry', 'expenseServiceEntry')
      .orderBy('expense.date', 'DESC')
      .addOrderBy('alert.createdAt', 'DESC')
      .where('car.ownerId = :userId', { userId })
      .getMany();

    return cars.map((car) => this.mapCarToResponse(car));
  }

  findCarByUser(userId: number, carId: number) {
    return this.carsRepository.findOne({
      where: { id: carId, ownerId: userId },
    });
  }

  findCarByLicensePlate(licensePlate: string) {
    return this.carsRepository.findOne({
      where: { licensePlate },
      relations: ['owner', 'owner.fcmTokens'],
    });
  }

  async addCarToBusiness(token: string, business: Business): Promise<Car> {
    const car = await this.carsRepository.findOne({
      where: { qrCode: token },
      relations: ['owner', 'owner.fcmTokens'],
    });

    if (!car) {
      throw new NotFoundException('car_not_found');
    }

    const alreadyAdded = await this.businessCarRepository.findOne({
      where: { car, business },
    });

    if (alreadyAdded) {
      throw new BadRequestException('car_already_added');
    }

    const newBusinessCar = this.businessCarRepository.create({
      car,
      business,
    });

    await this.expenseService.createServiceEntryExpense(
      car,
      business,
      business.name
    );

    await this.businessCarRepository.save(newBusinessCar);

    return car;
  }

  async changeBusinessAccess(
    userId: number,
    businessCarId: number,
    allowAccess: boolean
  ) {
    const businessCar = await this.businessCarRepository.findOne({
      where: { id: businessCarId },
      relations: ['car', 'car.owner'],
    });

    if (!businessCar) {
      throw new NotFoundException('business_car_not_found');
    }

    if (businessCar.car.owner.id !== userId) {
      throw new BadRequestException('cannot_change_access');
    }

    if (!allowAccess) {
      return this.businessCarRepository.delete(businessCarId);
    } else {
      businessCar.isAccessGranted = true;
      return this.businessCarRepository.save(businessCar);
    }
  }

  async createCar(
    car: CreateCarDto,
    images: BufferedFile[],
    userId: number
  ): Promise<CarResponseDto> {
    const model = await this.carModelsRepository.findOne({
      where: { id: car.modelId },
      relations: ['brand', 'category', 'category.brand'],
    });

    if (!model) {
      throw new NotFoundException('car_model_not_found');
    }

    const newCar = this.carsRepository.create({
      model,
      licensePlate: car.licensePlate,
      fuelType: car.fuelType,
      ownerId: userId,
      qrCode: randomBytes(28).toString('hex'),
    });

    if (images.length > 0) {
      const carImages = await this.imageService.storeImages(images);
      newCar.images = carImages;
    }

    await this.carsRepository.save(newCar);

    let brand: { id: number; name: string };
    if (model.category) {
      brand = {
        id: model.category.brand.id,
        name: model.category.brand.name,
      };
    } else if (model.brand) {
      brand = {
        id: model.brand.id,
        name: model.brand.name,
      };
    } else {
      throw new NotFoundException('car_brand_not_found');
    }

    return {
      id: newCar.id,
      model: {
        id: model.id,
        name: model.name,
      },
      qrCode: newCar.qrCode,
      brand,
      licensePlate: newCar.licensePlate,
      fuelType: newCar.fuelType,
      images: newCar.images.map((image) =>
        this.imageService.toImageResponse(image)
      ),
      expenses: [],
      alerts: [],
      businesses: [],
      deadlines: [],
    };
  }

  async deleteCar(carId: number, userId: number): Promise<void> {
    const car = await this.carsRepository.findOne({
      where: { id: carId, ownerId: userId },
    });

    if (!car) {
      throw new NotFoundException('car_not_found');
    }

    await this.carsRepository.delete(carId);
  }

  private mapCarToResponse(car: Car): CarResponseDto {
    let brand: { id: number; name: string };
    if (car.model.category) {
      brand = {
        id: car.model.category.brand.id,
        name: car.model.category.brand.name,
      };
    } else if (car.model.brand) {
      brand = {
        id: car.model.brand.id,
        name: car.model.brand.name,
      };
    } else {
      throw new NotFoundException('car_brand_not_found');
    }

    const mappedCar: CarResponse = {
      id: car.id,
      model: {
        id: car.model.id,
        name: car.model.name,
      },
      brand,
      licensePlate: car.licensePlate,
      fuelType: car.fuelType,
      qrCode: car.qrCode,
      images: car.images.map((image) =>
        this.imageService.toImageResponse(image)
      ),
      expenses: car.expenses,
      deadlines: car.deadlines.map((d) => ({
        id: d.id,
        deadline: d.deadline,
        isDone: d.isDone,
        createdAt: d.createdAt,
        title: d.title,
      })),
      alerts: car.alerts.map((a) => ({
        id: a.id,
        licensePlate: a.licensePlate,
        createdAt: a.createdAt,
        isResolved: a.isResolved,
        isArchived: a.isArchived,
        alertType: {
          id: a.alertType.id,
          title: a.alertType.title,
        },
      })),
      businesses: car.businesses.map((b) => ({
        businessCarId: b.id,
        businessId: b.business.id,
        isAccessGranted: b.isAccessGranted,
        createdAt: b.createdAt,
        businessName: b.business.name,
      })),
    };
    return mappedCar;
  }
}
