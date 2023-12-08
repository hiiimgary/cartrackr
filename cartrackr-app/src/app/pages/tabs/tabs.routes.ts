import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const tabsRoutes: Routes = [
  {
    path: '',
    component: TabsPage,

    children: [
      {
        path: 'car',
        loadChildren: () =>
          import('./pages/car/car.routes').then((m) => m.carRoutes),
      },
      {
        path: 'alert',
        loadChildren: () =>
          import('./pages/alert/alert.routes').then((m) => m.alertRoutes),
      },
      {
        path: 'maps',
        loadChildren: () =>
          import('./pages/maps/maps.routes').then((m) => m.mapsRoutes),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./pages/profile/profile.routes').then((m) => m.profileRoutes),
      },
      {
        path: '**',
        redirectTo: 'car',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'car',
  },
];
