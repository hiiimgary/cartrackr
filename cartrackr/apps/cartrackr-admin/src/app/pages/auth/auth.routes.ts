import { ActivatedRouteSnapshot, Route, Router } from '@angular/router';
import { AuthBasePage } from './pages/auth-base/auth-base.page';
import { inject } from '@angular/core';

export const authRoutes: Route[] = [
  {
    path: '',
    component: AuthBasePage,
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./pages/login/login.page').then((m) => m.LoginPage),
      },
      {
        path: 'login-verification',
        loadComponent: () =>
          import('./pages/login-verification/login-verification.page').then(
            (m) => m.LoginVerificationPage
          ),
        canActivate: [
          (route: ActivatedRouteSnapshot) => {
            if (route.queryParams?.['token']) {
              return true;
            }

            return inject(Router).createUrlTree(['/auth/login']);
          },
        ],
      },
      {
        path: 'registration',
        loadComponent: () =>
          import('./pages/registration/registration.page').then(
            (m) => m.RegistrationPage
          ),
      },
      {
        path: '**',
        redirectTo: 'login',
      },
    ],
  },
];
