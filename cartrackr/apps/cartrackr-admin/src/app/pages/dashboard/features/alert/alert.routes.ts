import { Route } from '@angular/router';

export const alertRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/alert-list/alert-list.component').then(
        (m) => m.AlertListComponent
      ),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./pages/alert-create/alert-create.component').then(
        (m) => m.AlertCreateComponent
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/alert-create/alert-create.component').then(
        (m) => m.AlertCreateComponent
      ),
  },
];
