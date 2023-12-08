import { Route } from '@angular/router';

export const refillStationRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/refill-station-list/refill-station-list.component').then(
        (m) => m.RefillStationListComponent
      ),
  },
  {
    path: 'create',
    loadComponent: () =>
      import(
        './pages/refill-station-create/refill-station-create.component'
      ).then((m) => m.RefillStationCreateComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import(
        './pages/refill-station-create/refill-station-create.component'
      ).then((m) => m.RefillStationCreateComponent),
  },
];
