import { Injectable, NotFoundException } from '@nestjs/common';
import { BusinessCar } from './entities/business-car.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Car } from '../car/entities/car.entity';
import { UserBusiness } from '../admin/user-business/entities/user-business.entity';
import { ImageService } from '../image/image.service';
import {
  BusinessCarDetailResponse,
  BusinessCarListResponse,
} from '@cartrackr/cartrackr-shared';
import { AppCarExpenseService } from '../app/app-car/app-car-expense.service';
import { CreateServiceEntryDto } from './dto/create-service-entry.dto';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class BusinessCarService {
  constructor(
    @InjectRepository(BusinessCar)
    private businessCarRepository: Repository<BusinessCar>,
    @InjectRepository(UserBusiness)
    private userBusinessRepository: Repository<UserBusiness>,
    private readonly expenseService: AppCarExpenseService,
    private readonly imageService: ImageService,
    private readonly nofiticationService: NotificationService
  ) {}

  async findAllByUserBusiness(
    userBusinessId: number
  ): Promise<BusinessCarListResponse[]> {
    const userBusiness = await this.userBusinessRepository
      .createQueryBuilder('userBusiness')
      .leftJoinAndSelect('userBusiness.business', 'business')
      .leftJoinAndSelect(
        'business.cars',
        'businessCar',
        'businessCar.isAccessGranted = true'
      )
      .leftJoinAndSelect('businessCar.car', 'car')
      .leftJoinAndSelect('car.model', 'model')
      .leftJoinAndSelect('car.images', 'images')
      .leftJoinAndSelect('model.category', 'category')
      .leftJoinAndSelect('category.brand', 'brand')
      .leftJoinAndSelect('model.brand', 'modelBrand')
      .where('userBusiness.id = :userBusinessId', { userBusinessId })
      .getOne();

    if (!userBusiness) {
      throw new NotFoundException('user-business-not-found');
    }

    return userBusiness.business.cars.map((businessCar) => {
      let brand: { id: number; name: string };
      if (businessCar.car.model.category) {
        brand = {
          id: businessCar.car.model.category.brand.id,
          name: businessCar.car.model.category.brand.name,
        };
      } else if (businessCar.car.model.brand) {
        brand = {
          id: businessCar.car.model.brand.id,
          name: businessCar.car.model.brand.name,
        };
      } else {
        throw new NotFoundException('car_brand_not_found');
      }

      return {
        businessCarId: businessCar.id,
        id: businessCar.car.id,
        model: {
          id: businessCar.car.model.id,
          name: businessCar.car.model.name,
        },
        brand,
        addedAt: businessCar.createdAt,
        licensePlate: businessCar.car.licensePlate,
        fuelType: businessCar.car.fuelType,
        images: businessCar.car.images.map((image) =>
          this.imageService.toImageResponse(image)
        ),
      };
    });
  }

  async findOne(
    businessCarId: number,
    userBusinessId: number
  ): Promise<BusinessCarDetailResponse> {
    const businessCar = await this.businessCarRepository
      .createQueryBuilder('businessCar')
      .leftJoinAndSelect('businessCar.car', 'car')
      .leftJoinAndSelect('businessCar.business', 'business')
      .leftJoinAndSelect('business.userBusinesses', 'userBusiness')
      .leftJoinAndSelect('car.model', 'model')
      .leftJoinAndSelect('car.images', 'images')
      .leftJoinAndSelect('car.expenses', 'expense')
      .leftJoinAndSelect('expense.expenseCategory', 'expenseCategory')
      .where('expenseCategory.slug = :expenseCategorySlug', {
        expenseCategorySlug: 'service-entry',
      })
      .leftJoinAndSelect('expense.serviceEntry', 'serviceEntry')
      .leftJoinAndSelect('serviceEntry.images', 'serviceEntryImage')
      .leftJoinAndSelect('model.category', 'category')
      .leftJoinAndSelect('category.brand', 'brand')
      .leftJoinAndSelect('model.brand', 'modelBrand')

      .andWhere('businessCar.id = :businessCarId', { businessCarId })
      .andWhere('userBusiness.id = :userBusinessId', { userBusinessId })
      .orderBy('expense.date', 'DESC')
      .getOne();

    const userBusiness = await this.userBusinessRepository.findOne({
      where: { id: userBusinessId },
      relations: ['business'],
    });

    let brand: { id: number; name: string };
    if (businessCar.car.model.category) {
      brand = {
        id: businessCar.car.model.category.brand.id,
        name: businessCar.car.model.category.brand.name,
      };
    } else if (businessCar.car.model.brand) {
      brand = {
        id: businessCar.car.model.brand.id,
        name: businessCar.car.model.brand.name,
      };
    } else {
      throw new NotFoundException('car_brand_not_found');
    }

    return {
      businessCarId: businessCar.id,
      id: businessCar.car.id,
      model: {
        id: businessCar.car.model.id,
        name: businessCar.car.model.name,
      },
      brand,
      addedAt: businessCar.createdAt,
      licensePlate: businessCar.car.licensePlate,
      fuelType: businessCar.car.fuelType,
      images: businessCar.car.images.map((image) =>
        this.imageService.toImageResponse(image)
      ),
      serviceEntries: businessCar.car.expenses
        .filter(
          (e) =>
            e.isFinalized ||
            e.serviceEntry.businessId === userBusiness.business.id
        )
        .map((e) => ({
          businessId: e.serviceEntry.businessId,
          serviceEntryId: e.serviceEntry.id,
          expenseId: e.id,
          isFinalized: e.isFinalized,
          isEditable:
            !e.isFinalized &&
            e.serviceEntry.businessId === userBusiness.business.id,
          price: e.price,
          title: e.title,
          date: e.date,
          description: e.serviceEntry.description,
          images: e.serviceEntry.images.map((image) =>
            this.imageService.toImageResponse(image)
          ),
        })),
    };
  }

  async update(
    updateBusinessCarDto: CreateServiceEntryDto,
    expenseId: number,
    userBusinessId: number
  ) {
    this.expenseService.updateServiceEntryExpense(
      updateBusinessCarDto,
      expenseId,
      userBusinessId
    );
  }

  async notifyOwner(businessCarId: number, message: string) {
    const businessCar = await this.businessCarRepository.findOne({
      where: { id: businessCarId },
      relations: ['car', 'car.owner', 'car.owner.fcmTokens', 'business'],
    });

    if (!businessCar) {
      throw new NotFoundException('business_car_not_found');
    }

    this.nofiticationService.sendPushNotification(
      businessCar.car.owner.fcmTokens.map((token) => token.token),
      {
        data: {
          carId: `${businessCar.car.id}`,
          type: 'service_notification',
        },
        notification: {
          title: `${businessCar.business.name}`,
          body: message,
        },
      }
    );
  }

  remove(id: number) {
    return this.businessCarRepository.delete({ id });
  }
}
