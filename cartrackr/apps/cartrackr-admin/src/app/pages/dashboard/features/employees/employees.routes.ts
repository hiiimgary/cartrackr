import { Route } from '@angular/router';

export const employeesRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/employees-list/employees-list.component').then(
        (m) => m.EmployeesListComponent
      ),
  },
  {
    path: 'invite',
    loadComponent: () =>
      import('./pages/employees-invite/employees-invite.component').then(
        (m) => m.EmployeesInviteComponent
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/employees-create/employees-create.component').then(
        (m) => m.EmployeesCreateComponent
      ),
  },
];
