import { Expense } from '@cartrackr/dtos';
import { List, PaginationMeta } from 'src/app/shared/types/list.types';

export type Expenses = PaginationMeta & {
  readonly monthlyAverage: number;
  readonly currentSpending: number;
  readonly list: List<Expense>;
};

export type CreateExpense = {
  readonly date: Date;
  readonly price: number;
  readonly expenseCategoryId: string;
  readonly title: string;
  readonly refill?: {
    readonly isFull: boolean;
    readonly amount: number;
    readonly mileage: number;
  };
};

export type ModifyExpense = CreateExpense & {
  readonly id: number;
};

export type ExpenseCategory = {
  readonly id: number;
  readonly slug: string;
  readonly name: string;
};
