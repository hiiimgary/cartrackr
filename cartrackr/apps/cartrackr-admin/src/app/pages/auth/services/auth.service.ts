import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  catchError,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { UserData } from '../types/user-data.types';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  #userData$: BehaviorSubject<UserData | null> =
    new BehaviorSubject<UserData | null>(null);

  userData$ = this.#userData$.asObservable();

  constructor(private readonly http: HttpClient) {}

  register$(payload: {
    email: string;
    lastName: string;
    firstName: string;
  }): Observable<unknown> {
    return this.http.post('admin-auth/registration', {
      destination: payload.email,
      lastName: payload.lastName,
      firstName: payload.firstName,
    });
  }

  login$(email: string): Observable<unknown> {
    return this.http.post('admin-auth/login', { destination: email });
  }

  verifyLogin$(token: string): Observable<unknown> {
    return this.http.get('admin-auth/login/callback', { params: { token } });
  }

  isLoggedIn$(): Observable<unknown> {
    return this.http.get<UserData>('admin-auth/is-logged-in').pipe(
      tap((userData: UserData) => {
        this.#userData$.next(userData);
      }),
      catchError((err) => {
        this.#userData$.next(null);
        return throwError(() => err);
      })
    );
  }

  selectBusiness$(id: number): Observable<unknown> {
    return this.http
      .post('admin-auth/select-business', { id })
      .pipe(switchMap(() => this.isLoggedIn$()));
  }

  logout$(): Observable<unknown> {
    return this.http.post('admin-auth/logout', {});
  }
}
