import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, tap } from 'rxjs';
import { selectIsLoggedIn } from 'src/app/auth/store/auth.selectors';

export const loggedInGuard: (config: {
  shouldLogin: boolean;
}) => CanActivateFn = (config) => (route, state) => {
  const router = inject(Router);
  return inject(Store)
    .select(selectIsLoggedIn)
    .pipe(
      map((isLoggedIn) =>
        isLoggedIn === config.shouldLogin
          ? true
          : config.shouldLogin
            ? router.createUrlTree(['/', 'login'])
            : router.createUrlTree(['/', 'tabs']),
      ),
    );
};
