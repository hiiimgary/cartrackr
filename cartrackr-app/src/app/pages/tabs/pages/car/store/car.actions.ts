import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { CreateCar } from '../types/create-car.types';
import { Car } from '../types/car.types';
import { CarBrand, Expense, ModifyCar } from '@cartrackr/dtos';
import { Alert, Alerts } from '../types/car-alert.types';
import { List } from 'src/app/shared/types/list.types';
import { CreateExpense, ModifyExpense } from '../types/car-expenses.types';
import {
  CreateDeadline,
  Deadline,
  ModifyDeadline,
} from '../types/car-deadlines.types';
import { Init } from '../types/init.types';

export const CarActions = createActionGroup({
  source: 'Car',
  events: {
    initSuccess: props<{ init: Init }>(),

    refresh: emptyProps(),
    refreshSuccess: props<{ cars: List<Car> }>(),
    // ----------------------------------------------
    // -----------------CAR--------------------------
    // ----------------------------------------------

    // Fetch Cars
    fetchCars: emptyProps(),
    fetchCarsSuccess: props<{ cars: List<Car> }>(),

    // Fetch Car Detail
    fetchCarDetailSuccess: props<{ car: Car }>(),

    // Create Car
    createCar: props<{ car: CreateCar }>(),
    createCarSuccess: props<{ car: Car }>(),
    createCarError: props<{ errorMsg: string }>(),

    // Modify Car
    modifyCar: props<{ car: ModifyCar }>(),
    modifyCarSuccess: props<{ car: Car }>(),
    modifyCarError: props<{ errorMsg: string }>(),

    // Delete Car
    deleteCar: props<{ carId: number }>(),
    deleteCarSuccess: props<{ carId: number }>(),

    // ----------------------------------------------
    // -----------------ALERTS-----------------------
    // ----------------------------------------------

    // Fetch Alerts
    fetchAlerts: props<{ page: number; carId: number }>(),
    fetchAlertsSuccess: props<{
      alerts: List<Alert>;
      currentPage: number;
      carId: number;
    }>(),

    // Resolve Alerts
    resolveAlert: props<{ alertId: number; carId: number }>(),
    resolveAlertError: props<{ alertId: number; carId: number }>(),

    // Delete Alerts
    deleteAlert: props<{ alertId: number; carId: number }>(),
    deleteAlertSuccess: props<{ alertId: number; carId: number }>(),
    deleteAlertError: props<{ alertId: number; carId: number }>(),

    // ----------------------------------------------
    // -----------------EXPENSES---------------------
    // ----------------------------------------------

    // Fetch Expenses
    fetchExpenses: props<{ page: number; carId: number }>(),
    fetchExpensesSuccess: props<{
      expenses: List<Expense>;
      currentPage: number;
      carId: number;
    }>(),

    // Create Expenses
    createExpense: props<{ carId: number; expense: CreateExpense }>(),
    createExpenseSuccess: props<{ expense: Expense; carId: number }>(),
    createExpenseError: props<{ errorMsg: string }>(),

    // Modify Expenses
    modifyExpense: props<{ carId: number; expense: ModifyExpense }>(),
    modifyExpenseSuccess: props<{ expense: Expense; carId: number }>(),
    modifyExpenseError: props<{ errorMsg: string }>(),

    // Delete Expense
    deleteExpense: props<{ expenseId: number; carId: number }>(),
    deleteExpenseSuccess: props<{ expenseId: number; carId: number }>(),
    deleteExpenseError: props<{ expenseId: number; carId: number }>(),

    // ----------------------------------------------
    // -----------------DEADLINE---------------------
    // ----------------------------------------------

    // Fetch Deadlines
    fetchDeadlines: props<{ page: number; carId: number }>(),
    fetchDeadlinesSuccess: props<{
      deadlines: List<Deadline>;
      currentPage: number;
      carId: number;
    }>(),

    // Create Deadline
    createDeadline: props<{ carId: number; deadline: CreateDeadline }>(),
    createDeadlineSuccess: props<{ deadline: Deadline; carId: number }>(),
    createDeadlineError: props<{ errorMsg: string }>(),

    // Modify Deadline
    modifyDeadline: props<{ carId: number; deadline: ModifyDeadline }>(),
    modifyDeadlineSuccess: props<{ deadline: Deadline; carId: number }>(),
    modifyDeadlineError: props<{ errorMsg: string }>(),

    // Mark Deadline Done
    markDeadlineDone: props<{ deadlineId: number; carId: number }>(),
    markDeadlineDoneError: props<{ deadlineId: number; carId: number }>(),

    // Delete Deadline
    deleteDeadline: props<{ deadlineId: number; carId: number }>(),
    deleteDeadlineSuccess: props<{ deadlineId: number; carId: number }>(),
    deleteDeadlineError: props<{ deadlineId: number; carId: number }>(),

    addCarToBusiness: props<{ token: string }>(),
    addCarToBusinessSuccess: emptyProps(),

    changeBusinessAccess: props<{
      allowAccess: boolean;
      businessCarId: number;
      carId: number;
    }>(),
    changeBusinessAccessSuccess: props<{
      allowAccess: boolean;
      businessCarId: number;
      carId: number;
    }>(),
  },
});
