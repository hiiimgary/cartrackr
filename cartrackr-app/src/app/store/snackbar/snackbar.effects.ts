import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { map, switchMap, tap } from 'rxjs/operators';
import { SnackbarActions } from './snackbar.actions';
import { ToastController } from '@ionic/angular';

@Injectable()
export class SnackbarEffects {
  showToast$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(SnackbarActions.showErrorMsg),
        tap((action) => {
          this.toastCtrl
            .create({
              message: action.message,
              color: 'danger',
              duration: 3000,
            })
            .then((toast) => {
              toast.present();
            });
        })
      );
    },
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private readonly toastCtrl: ToastController
  ) {}
}
