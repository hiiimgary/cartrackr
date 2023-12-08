import { Route } from '@angular/router';

export const carsRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/cars-list/cars-list.component').then(
        (m) => m.CarsListComponent
      ),
  },

  {
    path: ':id',
    loadComponent: () =>
      import('./pages/cars-create/cars-create.component').then(
        (m) => m.CarsCreateComponent
      ),
  },
  {
    path: ':id/notify',
    loadComponent: () =>
      import('./pages/cars-notify/cars-notify.component').then(
        (m) => m.CarsNotifyComponent
      ),
  },
];
