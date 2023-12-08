import { Routes } from '@angular/router';

export const businessRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/business-menu/business-menu.page').then(
        (m) => m.BusinessMenuPage
      ),
  },
  {
    path: 'scan-car',
    loadComponent: () =>
      import('./pages/business-scan-car/business-scan-car.page').then(
        (m) => m.BusinessScanCarPage
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
