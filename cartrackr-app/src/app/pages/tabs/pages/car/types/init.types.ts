import { List } from 'src/app/shared/types/list.types';
import { AlertCategory } from './car-alert.types';
import { ExpenseCategory } from './car-expenses.types';
import { CarBrand } from '@cartrackr/dtos';

export type Init = {
  carTypes: List<CarBrand>;
  expenseCategories: List<ExpenseCategory>;
  alertTypes: List<AlertCategory>;
};
