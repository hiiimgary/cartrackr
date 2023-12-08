import { Injectable } from '@nestjs/common';
import { CreateExpenseCategoryDto } from './dto/create-expense-category.dto';
import { UpdateExpenseCategoryDto } from './dto/update-expense-category.dto';
import { ExpenseCategory } from './entities/expense-category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ExpenseCategoryService {
  constructor(
    @InjectRepository(ExpenseCategory)
    private readonly expenseCategoryRepository: Repository<ExpenseCategory>
  ) {}

  create(createExpenseCategoryDto: CreateExpenseCategoryDto) {
    const expenseCategory = this.expenseCategoryRepository.create(
      createExpenseCategoryDto
    );

    return this.expenseCategoryRepository.save(expenseCategory);
  }

  findAll() {
    return this.expenseCategoryRepository.find();
  }

  findOne(id: number) {
    return this.expenseCategoryRepository.findOneBy({ id });
  }

  update(id: number, updateExpenseCategoryDto: UpdateExpenseCategoryDto) {
    return this.expenseCategoryRepository.update(
      { id },
      updateExpenseCategoryDto
    );
  }

  remove(id: number) {
    return this.expenseCategoryRepository.delete({ id });
  }
}
