import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../../pages/auth/services/auth.service';
import { Observable, catchError, map, of } from 'rxjs';

export const loginGuard: (options: {
  shouldLogin: boolean;
}) => CanActivateFn = (options) => {
  return (): Observable<boolean | UrlTree> => {
    const router = inject(Router);
    return inject(AuthService)
      .isLoggedIn$()
      .pipe(
        map(() =>
          options.shouldLogin === true
            ? true
            : router.createUrlTree(['/dashboard'])
        ),
        catchError(() =>
          of(options.shouldLogin ? router.createUrlTree(['/auth/login']) : true)
        )
      );
  };
};
