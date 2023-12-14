import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { Car } from '../types/car.types';
import { List } from 'src/app/shared/types/list.types';
import { Alert, AlertCategory } from '../types/car-alert.types';
import {
  CreateDeadline,
  Deadline,
  ModifyDeadline,
} from '../types/car-deadlines.types';
import {
  CreateExpense,
  ExpenseCategory,
  ModifyExpense,
} from '../types/car-expenses.types';
import {
  CarBrand,
  CarResponse,
  CreateCar,
  Expense,
  ModifyCar,
} from '@cartrackr/dtos';
import { serialize } from 'object-to-formdata';
import { Init } from '../types/init.types';
import parseISO from 'date-fns/parseISO';
import isSameMonth from 'date-fns/isSameMonth';

@Injectable({
  providedIn: 'root',
})
export class CarService {
  constructor(private readonly http: HttpClient) {}

  init$(): Observable<Init> {
    return this.http.get<Init>('init').pipe(
      tap((res) => {
        console.log(res);
      })
    );
  }

  createCar$(car: CreateCar, images: List<File>): Observable<Car> {
    const payload = serialize({
      ...car,
      images,
    });

    return this.http.post<CarResponse>('cars/create', payload).pipe(
      map((res) => {
        return this.mapCar(res);
      })
    );
  }

  fetchCarDetail$(id: number): Observable<Car> {
    return this.http.get<CarResponse>(`cars/${id}`).pipe(
      map((res) => {
        return this.mapCar(res);
      })
    );
  }

  modifyCar$(car: ModifyCar): Observable<Car> {
    return this.http.put<CarResponse>('cars/modify', car).pipe(
      map((res) => {
        return this.mapCar(res);
      })
    );
  }

  deleteCar$(carId: number): Observable<void> {
    return this.http.delete(`cars/${carId}`).pipe(
      map((res) => {
        return;
      })
    );
  }

  resolveAlert$(alertId: number, carId: number): Observable<void> {
    return this.http.post(`cars/${carId}/alerts/${alertId}/resolve`, {}).pipe(
      map((res) => {
        return;
      })
    );
  }

  deleteAlert$(alertId: number, carId: number): Observable<void> {
    return this.http.post(`cars/${carId}/alerts/${alertId}/archive`, {}).pipe(
      map((res) => {
        return;
      })
    );
  }

  createDeadline$(
    deadline: CreateDeadline,
    carId: number
  ): Observable<{ deadline: Deadline; carId: number }> {
    return this.http.post(`cars/${carId}/deadlines/create`, deadline).pipe(
      map((res) => {
        return {
          deadline: this.mapDeadline(res),
          carId,
        };
      })
    );
  }

  markDeadlineAsDone$(deadlineId: number, carId: number): Observable<unknown> {
    return this.http
      .post(`cars/${carId}/deadlines/${deadlineId}/mark-done`, {})
      .pipe();
  }

  deleteDeadline$(deadlineId: number, carId: number): Observable<void> {
    return this.http.delete(`cars/${carId}/deadlines/${deadlineId}`).pipe(
      map((res) => {
        return;
      })
    );
  }

  createExpense$(
    expense: CreateExpense,
    carId: number
  ): Observable<{ expense: Expense; carId: number }> {
    return this.http
      .post<Expense>(`cars/${carId}/expenses/create`, expense)
      .pipe(
        map((res) => {
          return {
            expense: this.mapExpense(res),
            carId,
          };
        })
      );
  }

  deleteExpense$(expenseId: number, carId: number): Observable<void> {
    return this.http.delete(`cars/${carId}/expenses/${expenseId}`).pipe(
      map((res) => {
        return;
      })
    );
  }

  addCarToBusiness$(token: string) {
    return this.http.post('cars/add-to-business', { token }).pipe(
      map((res) => {
        return;
      })
    );
  }

  changeBusinessAccess$(businessCarId: number, allowAccess: boolean) {
    return this.http
      .post('cars/change-business-access', { businessCarId, allowAccess })
      .pipe(
        map((res) => {
          return;
        })
      );
  }

  mapCar(car: CarResponse): Car {
    console.log(car);

    const refillExpenses = car.expenses.filter((e) => e.refill) || [];

    const currentMileage = refillExpenses[0]?.refill?.mileage || 0;

    const refills = refillExpenses
      .map((e) => ({
        date: parseISO(`${e.date}`),
        mileage: e.refill!.mileage,
        isFull: e.refill!.isFull,
        amount: e.refill!.amount,
      }))
      .reverse()
      .reduce<
        { date: Date; mileage: number; isFull: boolean; amount: number }[]
      >((acc, curr) => {
        if (acc.length === 0) {
          if (curr.isFull) {
            return [curr];
          } else {
            return [];
          }
        }

        const lastRefill = acc[acc.length - 1];

        if (lastRefill.isFull) {
          return [...acc, curr];
        } else {
          return [
            ...acc.slice(0, acc.length - 1),
            {
              ...curr,
              amount: lastRefill.amount + curr.amount,
            },
          ];
        }
      }, [])
      .reduce<
        {
          date: Date;
          mileage: number;
          isFull: boolean;
          amount: number;
          consumption: number;
        }[]
      >((acc, curr) => {
        if (acc.length === 0) {
          return [
            {
              ...curr,
              consumption: 0,
            },
          ];
        }

        const lastRefill = acc[acc.length - 1];

        const distanceTravelled = curr.mileage - lastRefill.mileage;

        const consumption = (curr.amount / distanceTravelled) * 100;

        return [
          ...acc,
          {
            ...curr,
            consumption,
          },
        ];
      }, [])
      .map((e) => {
        return {
          date: e.date,
          value: e.consumption,
        };
      })
      .filter((e) => e.value > 0);
    const expensesByMonth = car.expenses.reduce<
      List<{ date: Date; amount: number }>
    >((acc, curr) => {
      const expenseDate = parseISO(`${curr.date}`);
      const alreadyAddedMonth = acc.find((a) =>
        isSameMonth(a.date, expenseDate)
      );

      if (!alreadyAddedMonth) {
        return [
          ...acc,
          {
            date: expenseDate,
            amount: curr.price,
          },
        ];
      } else {
        return acc.map((a) => {
          if (isSameMonth(a.date, expenseDate)) {
            return {
              ...a,
              amount: a.amount + curr.price,
            };
          } else {
            return a;
          }
        });
      }
    }, []);

    const monthlyAverage =
      expensesByMonth.length === 0
        ? 0
        : expensesByMonth.reduce((acc, curr) => acc + curr.amount, 0) /
          expensesByMonth.length;
    const mappedCar: Car = {
      id: car.id,
      model: car.model,
      brand: car.brand,
      licensePlate: car.licensePlate,
      images: car.images,
      fuelType: car.fuelType,
      qrCode: car.qrCode,
      alerts: {
        currentPage: 1,
        hasMore: true,
        isLoading: false,
        unreadCount: car.alerts.filter((a) => !a.isResolved).length,
        list: car.alerts.map((a) => ({
          id: a.id,
          description: a.alertType.title,
          date: parseISO(`${a.createdAt}`),
          isDeleted: a.isArchived,
          isRead: a.isResolved,
        })),
      },
      consumption: {
        average:
          refills.reduce((acc, curr) => acc + curr.value, 0) / refills.length,
        refills,
      },
      deadlines: {
        currentPage: 1,
        hasMore: true,
        isLoading: false,
        list: car.deadlines.map((d) => {
          return {
            deadline: parseISO(`${d.deadline}`),
            title: d.title,
            id: d.id,
            isDone: d.isDone,
          };
        }),
      },
      expenses: {
        currentPage: 1,
        hasMore: true,
        isLoading: false,
        monthlyAverage: Math.floor(monthlyAverage),
        currentSpending: car.expenses
          .filter((e) => isSameMonth(parseISO(`${e.date}`), new Date()))
          .reduce((acc, curr) => acc + curr.price, 0),
        list: car.expenses.map((e) => ({
          ...e,
          date: parseISO(`${e.date}`),
        })),
      },
      mileage: {
        currentMileage,
        data: refillExpenses.map((e) => ({
          date: parseISO(`${e.date}`),
          value: e.refill!.mileage,
        })),
      },
      businesses: car.businesses,
    };

    return mappedCar;
  }

  mapExpense(expense: Expense): Expense {
    return {
      ...expense,
      date: parseISO(`${expense.date}`),
    };
  }

  mapDeadline(deadline: any): Deadline {
    return {
      deadline: parseISO(`${deadline.deadline}`),
      title: deadline.title,
      id: deadline.id,
      isDone: deadline.isDone,
    };
  }
}
