import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, tap } from 'rxjs';
import {
  selectIsLoggedIn,
  selectUserRole,
} from 'src/app/auth/store/auth.selectors';

export const roleGuard: (config: {
  role: 'business' | 'user';
  alternativeRoute: string[];
}) => CanActivateFn = (config) => (route, state) => {
  const router = inject(Router);
  return inject(Store)
    .select(selectUserRole)
    .pipe(
      map((role) =>
        role === config.role
          ? true
          : router.createUrlTree(config.alternativeRoute)
      )
    );
};
