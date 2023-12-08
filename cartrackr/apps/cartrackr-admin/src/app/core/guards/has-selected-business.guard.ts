import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../pages/auth/services/auth.service';
import { map, tap } from 'rxjs';

export const hasSelectedBusinessGuard: CanActivateFn = () => {
  const router = inject(Router);
  return inject(AuthService).userData$.pipe(
    tap((userdata) => console.log(userdata)),
    map((userData) =>
      userData?.activeBusiness !== null || userData?.user.isAdmin
        ? true
        : router.createUrlTree(['/business-selector'])
    )
  );
};
