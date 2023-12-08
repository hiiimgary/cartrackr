import { Route } from '@angular/router';
import { DashboardBasePage } from './pages/dashboard-base/dashboard-base.page';
import { adminGuard } from '../../core/guards/admin.guard';

export const dashboardRoutes: Route[] = [
  {
    path: '',
    component: DashboardBasePage,
    data: {
      navItems: [
        {
          title: 'Car types',
          icon: 'car',
          routerLink: '/dashboard/car-types',
          admin: true,
        },
        {
          title: 'Users',
          icon: 'person',
          routerLink: '/dashboard/users',
          admin: true,
        },
        {
          title: 'Alert types',
          icon: 'alert-circle',
          routerLink: '/dashboard/alerts',
          admin: true,
        },
        {
          title: 'Expense categories',
          icon: 'pricetags',
          routerLink: '/dashboard/expenses',
          admin: true,
        },
        {
          title: 'Businesses',
          icon: 'business',
          routerLink: '/dashboard/business',
          admin: true,
        },
        {
          title: 'Refill Stations',
          icon: 'business',
          routerLink: '/dashboard/refill-stations',
          admin: true,
        },
        {
          title: 'Employees',
          icon: 'person',
          routerLink: '/dashboard/employees',
          admin: false,
        },
        {
          title: 'Cars',
          icon: 'car',
          routerLink: '/dashboard/business-cars',
          admin: false,
        },
        {
          title: 'App login',
          icon: 'qr-code',
          routerLink: '/dashboard/app-login',
          admin: false,
        },
      ],
    },
    children: [
      {
        path: 'car-types',
        canActivate: [adminGuard({ shouldBeAdmin: true })],
        loadChildren: () =>
          import('./features/car-types/car-types.routes').then(
            (m) => m.carTypesRoutes
          ),
      },
      {
        path: 'alerts',
        canActivate: [adminGuard({ shouldBeAdmin: true })],
        loadChildren: () =>
          import('./features/alert/alert.routes').then((m) => m.alertRoutes),
      },
      {
        path: 'expenses',
        canActivate: [adminGuard({ shouldBeAdmin: true })],
        loadChildren: () =>
          import('./features/expense/expense.routes').then(
            (m) => m.expenseRoutes
          ),
      },
      {
        path: 'business',
        canActivate: [adminGuard({ shouldBeAdmin: true })],
        loadChildren: () =>
          import('./features/business/business.routes').then(
            (m) => m.businessRoutes
          ),
      },
      {
        path: 'refill-stations',
        canActivate: [adminGuard({ shouldBeAdmin: true })],
        loadChildren: () =>
          import('./features/refill-station/refill-station.routes').then(
            (m) => m.refillStationRoutes
          ),
      },
      {
        path: 'users',
        canActivate: [adminGuard({ shouldBeAdmin: true })],
        loadChildren: () =>
          import('./features/user/user.routes').then((m) => m.userRoutes),
      },
      {
        path: 'employees',
        canActivate: [adminGuard({ shouldBeAdmin: false })],
        loadChildren: () =>
          import('./features/employees/employees.routes').then(
            (m) => m.employeesRoutes
          ),
      },
      {
        path: 'business-cars',
        canActivate: [adminGuard({ shouldBeAdmin: false })],
        loadChildren: () =>
          import('./features/cars/cars.routes').then((m) => m.carsRoutes),
      },
      {
        path: 'app-login',
        canActivate: [adminGuard({ shouldBeAdmin: false })],
        loadComponent: () =>
          import('./pages/app-login/app-login.component').then(
            (m) => m.AppLoginComponent
          ),
      },
    ],
  },
];
