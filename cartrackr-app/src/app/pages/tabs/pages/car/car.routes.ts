import { Routes } from '@angular/router';
import { CarDetailPage } from './pages/car-detail/car-detail.page';

export const carRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/car-list/car-list.page').then((m) => m.CarListPage),
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./pages/create-car/create-car.page').then(
            (m) => m.CreateCarPage
          ),
      },
      {
        path: ':id',
        component: CarDetailPage,
        loadComponent: () =>
          import('./pages/car-detail/car-detail.page').then(
            (m) => m.CarDetailPage
          ),
      },
      {
        path: ':id/expenses',
        loadComponent: () =>
          import('./pages/car-expenses/car-expenses.page').then(
            (m) => m.CarExpensesPage
          ),
      },
      {
        path: ':id/service-entries',
        loadComponent: () =>
          import('./pages/car-service-entries/car-service-entries.page').then(
            (m) => m.CarServiceEntriesPage
          ),
      },
      {
        path: ':id/service-entries/:entryId',
        loadComponent: () =>
          import(
            './pages/car-service-entries/pages/car-service-entry-detail/car-service-entry-detail.page'
          ).then((m) => m.CarServiceEntryDetailPage),
      },
      {
        path: ':id/expenses/:expenseId',
        loadComponent: () =>
          import(
            './pages/car-expenses/pages/expense-detail/expense-detail.component'
          ).then((m) => m.ExpenseDetailComponent),
      },
      {
        path: ':id/deadlines',
        loadComponent: () =>
          import('./pages/car-deadlines/car-deadlines.page').then(
            (m) => m.CarDeadlinesPage
          ),
      },
      {
        path: ':id/alerts',
        loadComponent: () =>
          import('./pages/car-alerts/car-alerts.page').then(
            (m) => m.CarAlertsPage
          ),
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
