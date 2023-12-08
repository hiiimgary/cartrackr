import { Route } from '@angular/router';
import { loginGuard } from './core/guards/login.guard';
import { hasSelectedBusinessGuard } from './core/guards/has-selected-business.guard';
import { adminGuard } from './core/guards/admin.guard';

export const appRoutes: Route[] = [
  {
    path: '',
    canActivate: [loginGuard({ shouldLogin: false })],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'auth',
        loadChildren: () =>
          import('./pages/auth/auth.routes').then((m) => m.authRoutes),
      },
    ],
  },
  {
    path: '',
    canActivate: [loginGuard({ shouldLogin: true })],
    children: [
      {
        path: 'business-selector',
        canActivate: [adminGuard({ shouldBeAdmin: false })],
        loadChildren: () =>
          import('./pages/business-selector/business-selector.routes').then(
            (m) => m.businessSelectorRoutes
          ),
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./pages/dashboard/dashboard.routes').then(
            (m) => m.dashboardRoutes
          ),
        canActivate: [hasSelectedBusinessGuard],
      },
    ],
  },

  {
    path: '**',
    redirectTo: '',
  },
];
