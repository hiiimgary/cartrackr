import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Car } from '../../car/entities/car.entity';
import { Repository } from 'typeorm';
import { CreateExpense } from './dtos/create-expense.dto';
import { Expense } from '../../car/entities/expense.entity';
import { ExpenseCategory } from '../../expense-category/entities/expense-category.entity';
import { Refill } from '../../car/entities/refill.entity';
import isSameMonth from 'date-fns/isSameMonth';
import parseISO from 'date-fns/parseISO';
import { ServiceEntry } from '../../car/entities/service-entry.entity';
import { Business } from '../../business/entities/business.entity';
import { CreateServiceEntryDto } from '../../business-car/dto/create-service-entry.dto';
import { UserBusiness } from '../../admin/user-business/entities/user-business.entity';

@Injectable()
export class AppCarExpenseService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    @InjectRepository(ExpenseCategory)
    private readonly expenseCategoryRepository: Repository<ExpenseCategory>,
    @InjectRepository(ServiceEntry)
    private readonly serviceEntryRepository: Repository<ServiceEntry>,
    @InjectRepository(Refill)
    private readonly refillRepository: Repository<Refill>,
    @InjectRepository(UserBusiness)
    private readonly userBusinessRepository: Repository<UserBusiness>
  ) {}

  async createExpense(car: Car, expenseToCreate: CreateExpense) {
    const category = await this.expenseCategoryRepository.findOne({
      where: { slug: expenseToCreate.expenseCategoryId },
    });

    if (!category) {
      throw new NotFoundException('expense_category_not_found');
    }

    const expense = this.expenseRepository.create({
      ...expenseToCreate,
      expenseCategory: category,
      car,
    });

    return this.expenseRepository.save(expense);
  }

  async createServiceEntryExpense(car: Car, business: Business, title: string) {
    const category = await this.expenseCategoryRepository.findOne({
      where: { slug: 'service-entry' },
    });

    if (!category) {
      throw new NotFoundException('service_category_not_found');
    }

    const alreadyAddedDraft = await this.expenseRepository.findOne({
      where: {
        car: { id: car.id },
        serviceEntry: { business: { id: business.id } },
        isFinalized: false,
      },
      relations: ['serviceEntry', 'car', 'serviceEntry.business'],
    });

    if (alreadyAddedDraft) {
      return alreadyAddedDraft;
    }

    const expense = this.expenseRepository.create({
      title,
      date: new Date(),
      expenseCategory: category,
      car,
      serviceEntry: {
        businessId: business.id,
      },
      isFinalized: false,
    });

    return this.expenseRepository.save(expense);
  }

  async updateServiceEntryExpense(
    serviceEntry: CreateServiceEntryDto,
    expenseId: number,
    userBusinessId: number
  ) {
    const expense = await this.expenseRepository.findOne({
      where: { id: expenseId },
      relations: ['serviceEntry', 'car'],
    });

    if (!expense) {
      throw new NotFoundException('expense_not_found');
    }

    expense.serviceEntry.description = serviceEntry.description;
    expense.title = serviceEntry.title;
    expense.price = serviceEntry.price;

    if (serviceEntry.isFinalized) {
      expense.isFinalized = true;
      expense.date = new Date();
    }

    await this.expenseRepository.save(expense);

    const userBusiness = await this.userBusinessRepository.findOne({
      where: { id: userBusinessId },
      relations: ['business'],
    });

    await this.createServiceEntryExpense(
      expense.car,
      userBusiness.business,
      userBusiness.business.name
    );
  }

  deleteExpense(id: number) {
    return this.expenseRepository.delete({ id });
  }
}
