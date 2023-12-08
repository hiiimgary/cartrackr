import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'business',
    loadComponent: () =>
      import('./pages/business-login/business-login.page').then(
        (m) => m.BusinessLoginPage
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
