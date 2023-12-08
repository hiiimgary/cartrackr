import { Routes } from '@angular/router';

export const mapsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./maps.page').then((m) => m.MapsPage),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
