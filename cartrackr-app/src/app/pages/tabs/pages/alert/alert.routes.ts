import { Routes } from '@angular/router';
import { alertFeature } from './store/alert.reducer';
import { provideState } from '@ngrx/store';

export const alertRoutes: Routes = [
  {
    path: '',
    providers: [provideState(alertFeature)],
    loadComponent: () => import('./alert.page').then((m) => m.AlertPage),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
