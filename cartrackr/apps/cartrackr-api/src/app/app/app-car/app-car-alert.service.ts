import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from '../../car/entities/expense.entity';
import { ExpenseCategory } from '../../expense-category/entities/expense-category.entity';
import { AlertDriverDto } from './dtos/alert-driver.dto';
import { Car } from '../../car/entities/car.entity';
import { AlertType } from '../../alert/entities/alert-type.entity';
import { Alert } from '../../car/entities/alert.entity';

@Injectable()
export class AppCarAlertService {
  constructor(
    @InjectRepository(AlertType)
    private readonly alertTypeRepository: Repository<AlertType>,
    @InjectRepository(Alert)
    private readonly alertRepository: Repository<Alert>,
    @InjectRepository(ExpenseCategory)
    private readonly expenseCategoryRepository: Repository<ExpenseCategory>
  ) {}

  async alertDriver(
    car: Car,
    reason: number,
    licensePlate: string
  ): Promise<string> {
    const alertType = await this.alertTypeRepository.findOne({
      where: { id: reason },
    });

    if (!alertType) {
      throw new NotFoundException('alert_type_not_found');
    }

    const alert = this.alertRepository.create({
      alertType,
      car,
      licensePlate,
    });

    await this.alertRepository.save(alert);

    return alertType.title;
  }

  async resolveAlert(carId: number, id: number) {
    const alert = await this.alertRepository.findOne({
      where: { id, car: { id: carId } },
    });

    if (!alert) {
      throw new NotFoundException('alert_not_found');
    }

    return this.alertRepository.update({ id }, { isResolved: true });
  }

  async archiveAlert(carId: number, id: number) {
    const alert = await this.alertRepository.findOne({
      where: { id, car: { id: carId } },
    });

    if (!alert) {
      throw new NotFoundException('alert_not_found');
    }
    return this.alertRepository.update({ id }, { isArchived: true });
  }
}
