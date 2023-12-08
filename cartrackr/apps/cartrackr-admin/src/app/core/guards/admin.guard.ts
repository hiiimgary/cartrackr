import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../../pages/auth/services/auth.service';
import { Observable, map } from 'rxjs';

export const adminGuard: (options: {
  shouldBeAdmin: boolean;
}) => CanActivateFn = (options) => {
  return (): Observable<boolean | UrlTree> => {
    const router = inject(Router);
    return inject(AuthService).userData$.pipe(
      map((data) =>
        data?.user.isAdmin === options.shouldBeAdmin
          ? true
          : router.createUrlTree(['/dashboard'])
      )
    );
  };
};
