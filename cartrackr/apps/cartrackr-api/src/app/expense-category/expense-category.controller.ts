import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ExpenseCategoryService } from './expense-category.service';
import { CreateExpenseCategoryDto } from './dto/create-expense-category.dto';
import { UpdateExpenseCategoryDto } from './dto/update-expense-category.dto';
import { IdParams } from '../utils/models/params';

@Controller('expense-categories')
export class ExpenseCategoryController {
  constructor(
    private readonly expenseCategoryService: ExpenseCategoryService
  ) {}

  @Post()
  create(@Body() createExpenseCategoryDto: CreateExpenseCategoryDto) {
    return this.expenseCategoryService.create(createExpenseCategoryDto);
  }

  @Get()
  findAll() {
    return this.expenseCategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param() params: IdParams) {
    return this.expenseCategoryService.findOne(params.id);
  }

  @Post(':id')
  update(
    @Param() params: IdParams,
    @Body() updateExpenseCategoryDto: UpdateExpenseCategoryDto
  ) {
    return this.expenseCategoryService.update(
      params.id,
      updateExpenseCategoryDto
    );
  }

  @Delete(':id')
  remove(@Param() params: IdParams) {
    return this.expenseCategoryService.remove(params.id);
  }
}
