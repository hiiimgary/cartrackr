import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import {
  catchError,
  concatMap,
  exhaustMap,
  map,
  mergeMap,
  switchMap,
  tap,
} from 'rxjs/operators';
import { CarActions } from './car.actions';
import { CarService } from '../services/car.service';
import { EMPTY, of } from 'rxjs';
import { SnackbarActions } from 'src/app/store/snackbar/snackbar.actions';
import { AppActions } from 'src/app/store';
import { Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';

@Injectable()
export class CarEffects {
  fetchCarTypes$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AppActions.init),
      switchMap(() => {
        return this.carService.init$().pipe(
          map((init) => {
            return CarActions.initSuccess({ init });
          }),
          catchError((error) => {
            return of(
              SnackbarActions.showErrorMsg({
                message: 'Something went wrong.',
              }),
            );
          }),
        );
      }),
    );
  });

  createCar$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CarActions.createCar),
      exhaustMap((action) => {
        return this.carService
          .createCar$(
            {
              licensePlate: action.car.licensePlate,
              modelId: action.car.modelId,
              brandId: action.car.brandId,
              fuelType: action.car.fuelType,
            },
            action.car.images.map((i) => i.file),
          )
          .pipe(
            map((car) => {
              this.modalCtrl.dismiss();
              return CarActions.createCarSuccess({ car });
            }),
            catchError((error) => {
              return of(
                CarActions.createCarError({
                  errorMsg: 'Something went wrong.',
                }),
              );
            }),
          );
      }),
    );
  });

  modifyCar$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CarActions.modifyCar),
      concatMap((action) => {
        return this.carService.modifyCar$(action.car).pipe(
          map((car) => {
            return CarActions.modifyCarSuccess({ car });
          }),
          catchError((error) => {
            return of(
              CarActions.modifyCarError({ errorMsg: 'Something went wrong.' }),
            );
          }),
        );
      }),
    );
  });

  deleteCar$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CarActions.deleteCar),
      mergeMap((action) => {
        return this.carService.deleteCar$(action.carId).pipe(
          tap(() => this.router.navigateBack(['/tabs/cars'])),
          map(() => {
            return CarActions.deleteCarSuccess({ carId: action.carId });
          }),
          catchError((error) => {
            return of(
              SnackbarActions.showErrorMsg({
                message: 'Something went wrong.',
              }),
            );
          }),
        );
      }),
    );
  });

  resolveAlert$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CarActions.resolveAlert),
      concatMap((action) => {
        return this.carService.resolveAlert$(action.alertId, action.carId).pipe(
          switchMap(() => EMPTY),
          catchError(() => {
            return of(
              CarActions.resolveAlertError({
                alertId: action.alertId,
                carId: action.carId,
              }),
            );
          }),
        );
      }),
    );
  });

  deleteAlert$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CarActions.deleteAlert),
      concatMap((action) => {
        return this.carService.deleteAlert$(action.alertId, action.carId).pipe(
          map(() =>
            CarActions.deleteAlertSuccess({
              alertId: action.alertId,
              carId: action.carId,
            }),
          ),
          catchError(() => {
            return of(
              CarActions.deleteAlertError({
                alertId: action.alertId,
                carId: action.carId,
              }),
            );
          }),
        );
      }),
    );
  });

  createExpense$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CarActions.createExpense),
      concatMap((action) => {
        return this.carService
          .createExpense$(action.expense, action.carId)
          .pipe(
            map(({ expense, carId }) => {
              this.modalCtrl.dismiss();
              return CarActions.createExpenseSuccess({ expense, carId });
            }),
            catchError(() => {
              return of(
                SnackbarActions.showErrorMsg({
                  message: 'Something went wrong.',
                }),
              );
            }),
          );
      }),
    );
  });

  deleteExpense$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CarActions.deleteExpense),
      concatMap((action) => {
        return this.carService
          .deleteExpense$(action.expenseId, action.carId)
          .pipe(
            map(() =>
              CarActions.deleteExpenseSuccess({
                expenseId: action.expenseId,
                carId: action.carId,
              }),
            ),
            catchError(() => {
              return of(
                CarActions.deleteExpenseError({
                  expenseId: action.expenseId,
                  carId: action.carId,
                }),
              );
            }),
          );
      }),
    );
  });

  createDeadline$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CarActions.createDeadline),
      concatMap((action) => {
        return this.carService
          .createDeadline$(action.deadline, action.carId)
          .pipe(
            map(({ deadline, carId }) => {
              this.modalCtrl.dismiss();
              return CarActions.createDeadlineSuccess({ deadline, carId });
            }),
            catchError(() => {
              return of(
                SnackbarActions.showErrorMsg({
                  message: 'Something went wrong.',
                }),
              );
            }),
          );
      }),
    );
  });

  markDeadlineAsDone$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CarActions.markDeadlineDone),
      concatMap((action) => {
        return this.carService
          .markDeadlineAsDone$(action.deadlineId, action.carId)
          .pipe(
            switchMap(() => EMPTY),
            catchError(() => {
              return of(
                CarActions.markDeadlineDoneError({
                  deadlineId: action.deadlineId,
                  carId: action.carId,
                }),
              );
            }),
          );
      }),
    );
  });

  deleteDeadline$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CarActions.deleteDeadline),
      concatMap((action) => {
        return this.carService
          .deleteDeadline$(action.deadlineId, action.carId)
          .pipe(
            map(() =>
              CarActions.deleteDeadlineSuccess({
                deadlineId: action.deadlineId,
                carId: action.carId,
              }),
            ),
            catchError(() => {
              return of(
                CarActions.deleteDeadlineError({
                  deadlineId: action.deadlineId,
                  carId: action.carId,
                }),
              );
            }),
          );
      }),
    );
  });

  addToBusiness$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CarActions.addCarToBusiness),
      switchMap((action) => {
        return this.carService.addCarToBusiness$(action.token).pipe(
          map(() => {
            this.navCtrl.back();
            return CarActions.addCarToBusinessSuccess();
          }),
          catchError(() => {
            return of(
              SnackbarActions.showErrorMsg({
                message: 'Something went wrong.',
              }),
            );
          }),
        );
      }),
    );
  });

  changeBusinessAccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CarActions.changeBusinessAccess),
      switchMap((action) => {
        return this.carService
          .changeBusinessAccess$(action.businessCarId, action.allowAccess)
          .pipe(
            map(() => {
              return CarActions.changeBusinessAccessSuccess({
                allowAccess: action.allowAccess,
                businessCarId: action.businessCarId,
                carId: action.carId,
              });
            }),
            catchError(() => {
              return of(
                SnackbarActions.showErrorMsg({
                  message: 'Something went wrong.',
                }),
              );
            }),
          );
      }),
    );
  });

  constructor(
    private actions$: Actions,
    private readonly carService: CarService,
    private readonly router: NavController,
    private readonly modalCtrl: ModalController,
    private readonly navCtrl: NavController,
  ) {}
}
