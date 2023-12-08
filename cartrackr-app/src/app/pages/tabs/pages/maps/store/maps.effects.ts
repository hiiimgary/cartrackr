import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { SnackbarActions } from 'src/app/store/snackbar/snackbar.actions';
import { AppActions } from 'src/app/store';
import { MapsService } from '../services/maps.service';
import { MapsActions } from './maps.actions';

@Injectable()
export class MapsEffects {
  fetchLocations$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MapsActions.fetchLocations),
      switchMap(() => {
        return this.mapsService.fetchLocations$().pipe(
          map((locations) => {
            return MapsActions.fetchLocationsSuccess({ locations });
          }),
          catchError((error) => {
            return of(
              SnackbarActions.showErrorMsg({ message: 'Something went wrong.' })
            );
          })
        );
      })
    );
  });

  constructor(
    private actions$: Actions,
    private readonly mapsService: MapsService
  ) {}
}
