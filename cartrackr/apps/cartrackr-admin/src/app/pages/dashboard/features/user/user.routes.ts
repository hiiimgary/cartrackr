import { Route } from '@angular/router';

export const userRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/user-list/user-list.component').then(
        (m) => m.UserListComponent
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/user-create/user-create.component').then(
        (m) => m.UserCreateComponent
      ),
  },
];
