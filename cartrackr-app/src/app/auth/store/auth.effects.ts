import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AuthActions } from './auth.actions';
import { AuthService } from '../services/auth.service';
import { from, of } from 'rxjs';
import { SnackbarActions } from 'src/app/store/snackbar/snackbar.actions';
import { Router } from '@angular/router';
import { AppActions } from 'src/app/store';
import { CarService } from 'src/app/pages/tabs/pages/car/services/car.service';
import { NavController } from '@ionic/angular';
import { PushNotificationService } from 'src/app/core/notification/push-notification.service';
import { CarActions } from 'src/app/pages/tabs/pages/car/store/car.actions';

@Injectable()
export class AuthEffects {
  isLoggedIn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.isLoggedIn, AppActions.init, CarActions.createExpense),
      switchMap(() =>
        this.authService.isLoggedIn$().pipe(
          map((payload) =>
            AuthActions.loggedIn({
              user: payload.user,
              cars: payload.cars.map(this.carService.mapCar),
            })
          ),
          catchError(() => of(AuthActions.notLoggedIn()))
        )
      )
    )
  );

  refresh$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CarActions.refresh),
      switchMap(() =>
        this.authService.isLoggedIn$().pipe(
          map((payload) =>
            CarActions.refreshSuccess({
              cars: payload.cars.map(this.carService.mapCar),
            })
          ),
          catchError(() => of(AuthActions.notLoggedIn()))
        )
      )
    )
  );

  signInWithApple$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signInWithApple),
      switchMap((action) =>
        this.authService.signInWithApple$(action.payload).pipe(
          map(() => AuthActions.isLoggedIn()),
          catchError(() =>
            of(
              SnackbarActions.showErrorMsg({
                message: 'Something went wrong.',
              })
            )
          )
        )
      )
    )
  );

  signInWithGoogle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signInWithGoogle),
      switchMap(() =>
        from(GoogleAuth.signIn()).pipe(
          switchMap((res) => {
            console.log(res.authentication.idToken);

            return this.authService.signInWithGoogle$({
              idToken: res.authentication.idToken,
            });
          })
        )
      ),
      map(() => AuthActions.isLoggedIn()),
      catchError(() =>
        of(SnackbarActions.showErrorMsg({ message: 'Something went wrong.' }))
      )
    )
  );

  signInWithBusiness$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signInWithBusiness),
      switchMap((action) =>
        this.authService.signInWithBusiness$(action.payload).pipe(
          map(() => AuthActions.isLoggedIn()),
          catchError(() =>
            of(
              SnackbarActions.showErrorMsg({
                message: 'Something went wrong.',
              })
            )
          )
        )
      )
    )
  );

  initPush$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loggedIn),
        tap(() => this.pushService.initPush())
      ),
    { dispatch: false }
  );

  navigateToTabs$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loggedIn),
        tap(() => this.router.navigate(['/', 'tabs']))
      ),
    { dispatch: false }
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        switchMap(() => this.pushService.disablePushNotifications$()),
        switchMap(() => this.authService.logout$()),
        tap(() => this.navController.navigateRoot(['/', 'auth']))
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private readonly carService: CarService,
    private readonly router: Router,
    private readonly navController: NavController,
    private readonly pushService: PushNotificationService
  ) {}
}
