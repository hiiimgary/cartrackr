import { Route } from '@angular/router';

export const expenseRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/expense-list/expense-list.component').then(
        (m) => m.ExpenseListComponent
      ),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./pages/expense-create/expense-create.component').then(
        (m) => m.ExpenseCreateComponent
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/expense-create/expense-create.component').then(
        (m) => m.ExpenseCreateComponent
      ),
  },
];
