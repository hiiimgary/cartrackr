import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import {
  BehaviorSubject,
  Observable,
  filter,
  switchMap,
  from,
  take,
  forkJoin,
  map,
} from 'rxjs';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import { Tokens } from '@cartrackr/dtos';

export const STORAGE_JWT_TOKEN = 'jwt-token';
export const STORAGE_REFRESH_TOKEN = 'refresh-token';
export const STORAGE_FIREBASE_TOKEN = 'firebase-token';

@Injectable()
export class StorageService {
  private readonly storageReady$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  constructor(private readonly storage: Storage) {
    this.init();
  }

  init(): void {
    this.storage
      .defineDriver(CordovaSQLiteDriver)
      .then(() => this.storage.create())
      .then(() => {
        this.storageReady$.next(true);
      });
  }

  get$<T>(key: string): Observable<T> {
    return this.storageReady$.pipe(
      filter((ready: boolean) => ready),
      switchMap(() => from(this.storage.get(key))),
      take(1)
    );
  }

  set$<T>(key: string, data: T): Observable<T> {
    return this.storageReady$.pipe(
      filter((ready: boolean) => ready),
      switchMap(() => from(this.storage.set(key, data))),
      take(1)
    );
  }

  setAuthTokens$(tokens: Tokens): Observable<Tokens> {
    return forkJoin([
      this.set$(STORAGE_JWT_TOKEN, tokens.accessToken),
      this.set$(STORAGE_REFRESH_TOKEN, tokens.refreshToken),
    ]).pipe(map(() => tokens));
  }
}
