import {
  HttpClient,
  HttpEvent,
  HttpHandler,
  HttpHandlerFn,
  HttpInterceptor,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, filter, map, switchMap, take, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import {
  STORAGE_JWT_TOKEN,
  STORAGE_REFRESH_TOKEN,
  StorageService,
} from '../storage/services/storage.service';
import { Tokens } from '@cartrackr/dtos';
import { AuthService } from 'src/app/auth/services/auth.service';

export const tokenInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  if (req.url.includes('.json')) {
    return next(req);
  }

  const storageService = inject(StorageService);
  const authService = inject(AuthService);

  req = req.clone({
    url: `${environment.apiUrl}/${req.url}`,
  });

  return storageService.get$<string>(STORAGE_JWT_TOKEN).pipe(
    switchMap((token: string) => {
      return next(authService.addToken(req, token));
    }),
    catchError((err) => {
      console.error(`${req.url}: `, err);

      if (err.status === 401 && err.error.message === 'expired_token') {
        if (req.url.includes('token/refresh')) {
          return throwError(() => err);
        } else {
          return authService.refreshTokens$(req, next);
        }
      } else {
        return throwError(() => err);
      }
    })
  );
};
