import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateRefillExpense {
  @IsNumber()
  mileage: number;

  @IsNumber()
  amount: number;

  @IsBoolean()
  isFull: boolean;
}

export class CreateExpense {
  @IsString()
  expenseCategoryId: string;

  @IsString()
  title: string;

  @IsDateString()
  date: Date;

  @IsNumber()
  price: number;

  @ValidateNested()
  refill: CreateRefillExpense;
}
