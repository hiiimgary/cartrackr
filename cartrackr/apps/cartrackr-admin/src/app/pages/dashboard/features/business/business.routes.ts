import { Route } from '@angular/router';

export const businessRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/business-list/business-list.component').then(
        (m) => m.BusinessListComponent
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/business-create/business-create.component').then(
        (m) => m.BusinessCreateComponent
      ),
  },
];
