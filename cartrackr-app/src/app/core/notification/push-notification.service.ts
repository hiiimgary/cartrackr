import { Injectable } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';

import { switchMap, take, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import {
  STORAGE_FIREBASE_TOKEN,
  StorageService,
} from '../storage/services/storage.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Store } from '@ngrx/store';
import { AuthActions } from 'src/app/auth/store/auth.actions';
import { CarActions } from 'src/app/pages/tabs/pages/car/store/car.actions';

@Injectable({
  providedIn: 'root',
})
export class PushNotificationService {
  constructor(
    private readonly plt: Platform,
    private readonly storage: StorageService,
    private readonly store: Store,
    private readonly navCtrl: NavController,
    private readonly authService: AuthService,
  ) {}

  initPush(): void {
    if (this.plt.is('hybrid')) {
      this.registerPush();
    }
  }

  disablePushNotifications$(): Observable<any> {
    if (!this.plt.is('hybrid')) {
      return of(null);
    }

    return this.storage.get$<string>(STORAGE_FIREBASE_TOKEN).pipe(
      tap((token) => {
        if (!token) {
          return;
        }
        PushNotifications.removeAllListeners();
        PushNotifications.removeAllDeliveredNotifications();
      }),
      switchMap((token: string) => {
        if (!token) {
          return of(null);
        } else {
          return this.authService.deleteFirebaseToken$({ token });
        }
      }),
      switchMap(() => this.storage.set$(STORAGE_FIREBASE_TOKEN, null)),
    );
  }

  private async registerPush(): Promise<void> {
    this.storage.get$<string>(STORAGE_FIREBASE_TOKEN).subscribe((token) => {
      if (!token) {
        PushNotifications.requestPermissions().then((result) => {
          if (result.receive === 'granted') {
            PushNotifications.register();
          } else {
            // Show some error
          }
        });

        PushNotifications.addListener('registration', (token: Token) => {
          console.log(token.value);

          this.sendFirebaseToken(token.value);
        });

        // PushNotifications.addListener('registrationError', (error: any) => {
        // });
      }
    });

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        this.store.dispatch(CarActions.refresh());
      },
    );

    // Method called when tapping on a notification
    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        // const data: PushNotificationData = notification.notification.data;
        // const type = parseInt(data.dataType, 10);
        // if (!type) {
        //   return;
        // }
        // const urlMapperFn = this.notificationUrlMap[type];
        // if (!urlMapperFn) {
        //   return;
        // }
        // this.navCtrl.navigateForward(urlMapperFn(data));
      },
    );
  }

  private sendFirebaseToken(token: string): void {
    this.authService
      .setFirebaseToken$({ token })
      .pipe(
        switchMap(() => this.storage.set$(STORAGE_FIREBASE_TOKEN, token)),
        take(1),
      )
      .subscribe();
  }
}
