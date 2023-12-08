import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { catchError, concatMap, map, switchMap } from 'rxjs/operators';
import { Observable, EMPTY, of } from 'rxjs';
import { AlertActions } from './alert.actions';
import { AlertService } from '../services/alert.service';
import { SnackbarActions } from 'src/app/store/snackbar/snackbar.actions';

@Injectable()
export class AlertEffects {
  alertDriver$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AlertActions.alertDriver),
      switchMap(({ licensePlate, reason }) =>
        this.alertService.alertDriver$(licensePlate, reason).pipe(
          map(() => {
            return AlertActions.alertDriverSuccess();
          }),
          catchError(() => of(AlertActions.alertDriverError()))
        )
      )
    );
  });

  alertDriverError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AlertActions.alertDriverError),
        map(() =>
          SnackbarActions.showErrorMsg({
            message: 'Something went wrong.',
          })
        )
      ),
    { dispatch: true }
  );

  constructor(
    private actions$: Actions,
    private readonly alertService: AlertService
  ) {}
}
