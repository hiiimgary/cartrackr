import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromCar from './car.reducer';
import { CarListItem } from '../pages/car-list/types/car-list-item.types';
import { List } from 'src/app/shared/types/list.types';
import { CarDetail } from '../pages/car-detail/types/car-detail.types';
import { Alerts } from '../types/car-alert.types';
import { Deadlines } from '../types/car-deadlines.types';
import isSameMonth from 'date-fns/isSameMonth';
import { SelectOption } from 'src/app/shared/types/select.types';
import { BusinessCar, Expense } from '@cartrackr/dtos';

const selectCarState = createFeatureSelector<fromCar.State>(
  fromCar.carFeatureKey
);

export const selectAddExpenseIsLoading = createSelector(
  selectCarState,
  (state) => state.addExpenseState.isLoading
);

export const selectCarList = createSelector(
  selectCarState,
  (state): List<CarListItem> =>
    state.cars.map((c) => ({
      id: c.id,
      licensePlate: c.licensePlate,
      thumbnail: c.images.length > 0 ? c.images[0] : null,
    }))
);

export const selectExpenseCategories = createSelector(
  selectCarState,
  (state): List<SelectOption> =>
    state.expenseCategories.map((c) => ({
      key: c.slug,
      value: c.name,
    }))
);

export const selectAlertCategories = createSelector(selectCarState, (state) =>
  state.alertCategories.map((c) => ({ key: c.id, value: c.title }))
);

export const selectCarBrands = createSelector(
  selectCarState,
  (state) => state.carTypes
);

export const selectCar = (id: number) =>
  createSelector(selectCarState, (state): CarDetail => {
    const car = state.cars.find((c) => c.id === id);

    if (!car) {
      throw new Error(`Car with id ${id} not found`);
    }

    return car;
  });

export const selectCarAlerts = (id: number) =>
  createSelector(selectCar(id), (car): Alerts => {
    if (!car) {
      throw new Error(`Car with id ${id} not found`);
    }

    return {
      ...car.alerts,
      list: car.alerts.list.filter((a) => !a.isDeleted),
    };
  });

export const selectCarServiceEntries = (carId: number) =>
  createSelector(selectCar(carId), (car) => {
    return car.expenses.list.filter(
      (e) => e.expenseCategory.slug === 'service-entry'
    );
  });

export const selectCarExpenses = (id: number) =>
  createSelector(
    selectCar(id),
    selectExpenseCategories,
    (
      car,
      expenseCategories
    ): List<{
      date: Date;
      list: List<Expense & { readonly title: string }>;
    }> => {
      if (!car) {
        throw new Error(`Car with id ${id} not found`);
      }

      return car.expenses.list.reduce<
        List<{ date: Date; list: List<Expense & { readonly title: string }> }>
      >((acc, curr) => {
        const alreadyAddedMonth = acc.find((a) =>
          isSameMonth(a.date, curr.date)
        );

        if (!alreadyAddedMonth) {
          return [
            ...acc,
            {
              date: curr.date,
              list: [curr],
            },
          ];
        } else {
          return acc.map((a) => {
            if (isSameMonth(a.date, curr.date)) {
              return {
                ...a,
                list: [...a.list, curr],
              };
            } else {
              return a;
            }
          });
        }
      }, []);
    }
  );

export const selectCarExpenseDetail = (carId: number, expenseId: number) =>
  createSelector(selectCar(carId), (car) => {
    return car.expenses.list.find((e) => e.id === expenseId);
  });

export const selectCarDeadlines = (id: number) =>
  createSelector(selectCar(id), (car): Deadlines => {
    if (!car) {
      throw new Error(`Car with id ${id} not found`);
    }

    return car.deadlines;
  });
