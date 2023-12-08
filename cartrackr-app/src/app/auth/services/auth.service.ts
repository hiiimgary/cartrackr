import { HttpClient, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AppleLoginRequest,
  FirebaseTokenRequest,
  GoogleLoginRequest,
  IsLoggedInResponse,
  LoginResponse,
  RefreshTokenRequest,
  Tokens,
} from '@cartrackr/dtos';
import {
  BehaviorSubject,
  Observable,
  catchError,
  filter,
  map,
  of,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import {
  STORAGE_REFRESH_TOKEN,
  StorageService,
} from 'src/app/core/storage/services/storage.service';
import { Store } from '@ngrx/store';
import { AuthActions } from '../store/auth.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isRefreshing = false;
  private accessTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(
    private readonly http: HttpClient,
    private readonly storageService: StorageService,
    private readonly store: Store,
  ) {}

  isLoggedIn$(): Observable<IsLoggedInResponse> {
    return this.http.get<IsLoggedInResponse>(`auth/is-logged-in`).pipe();
  }

  signInWithApple$(payload: AppleLoginRequest): Observable<unknown> {
    return this.http
      .post<LoginResponse>('auth/sign-in-with-apple', payload)
      .pipe(
        switchMap((res) =>
          this.storageService.setAuthTokens$({
            accessToken: res.accessToken,
            refreshToken: res.refreshToken,
          }),
        ),
      );
  }

  signInWithGoogle$(payload: GoogleLoginRequest): Observable<unknown> {
    return this.http
      .post<LoginResponse>('auth/sign-in-with-google', payload)
      .pipe(
        switchMap((res) =>
          this.storageService.setAuthTokens$({
            accessToken: res.accessToken,
            refreshToken: res.refreshToken,
          }),
        ),
      );
  }

  signInWithBusiness$(payload: { token: string }): Observable<unknown> {
    return this.http
      .post<LoginResponse>('auth/sign-in-with-business-id', payload)
      .pipe(
        switchMap((res) =>
          this.storageService.setAuthTokens$({
            accessToken: res.accessToken,
            refreshToken: '',
          }),
        ),
      );
  }

  logout$(): Observable<any> {
    return this.storageService.setAuthTokens$({
      refreshToken: '',
      accessToken: '',
    });
  }

  setFirebaseToken$(payload: FirebaseTokenRequest): Observable<unknown> {
    return this.http
      .post(`auth/set-firebase-token`, payload)
      .pipe(catchError(() => of(null)));
  }

  deleteFirebaseToken$(payload: FirebaseTokenRequest): Observable<unknown> {
    return this.http
      .post(`auth/delete-firebase-token`, payload)
      .pipe(catchError(() => of(null)));
  }

  refreshTokens$(request: HttpRequest<any>, next: HttpHandlerFn) {
    if (!this.isRefreshing) {
      this.accessTokenSubject.next(null);
      this.isRefreshing = true;
      return this.refreshTokenApiCall$().pipe(
        catchError((error: any) => {
          this.store.dispatch(AuthActions.logout());
          this.isRefreshing = false;
          return throwError(() => error);
        }),
        switchMap((result: Tokens) => {
          this.accessTokenSubject.next(result.accessToken);
          this.isRefreshing = false;
          return next(this.addToken(request, result.accessToken));
        }),
      );
    } else {
      return this.accessTokenSubject.pipe(
        filter((token) => token != null),
        take(1),
        switchMap((jwt) => next(this.addToken(request, jwt!))),
      );
    }
  }

  addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    });
  }

  private refreshTokenApiCall$(): Observable<Tokens> {
    return this.storageService.get$<string>(STORAGE_REFRESH_TOKEN).pipe(
      map((token: string) => {
        if (token) {
          return token;
        } else {
          throw new Error('No Refresh Token');
        }
      }),
      switchMap((token: string) => {
        const payload: RefreshTokenRequest = {
          refreshToken: token,
        };
        return this.http.post<Tokens>('auth/token/refresh', payload);
      }),
      switchMap((tokens: Tokens) => {
        return this.storageService.setAuthTokens$(tokens);
      }),
    );
  }
}
