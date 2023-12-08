import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { filter, tap } from 'rxjs';
import { AuthActions } from './auth/store/auth.actions';
import { selectIsAppInited } from './auth/store/auth.selectors';
import { loggedInGuard } from './core/guards/logged-in.guard';
import { AppActions } from './store';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [
      () => {
        const store = inject(Store);

        store.dispatch(AppActions.init());

        return store
          .select(selectIsAppInited)
          .pipe(filter((isInited) => isInited));
      },
    ],
    children: [
      {
        path: 'login',
        canActivate: [loggedInGuard({ shouldLogin: false })],
        loadChildren: () =>
          import('./pages/auth/auth.routes').then((m) => m.authRoutes),
      },
      {
        path: 'tabs',
        canActivate: [
          loggedInGuard({ shouldLogin: true }),
          roleGuard({ role: 'user', alternativeRoute: ['/', 'business'] }),
        ],
        loadChildren: () =>
          import('./pages/tabs/tabs.routes').then((m) => m.tabsRoutes),
      },
      {
        path: 'business',
        canActivate: [
          loggedInGuard({ shouldLogin: true }),
          roleGuard({ role: 'business', alternativeRoute: ['/', 'tabs'] }),
        ],
        loadChildren: () =>
          import('./pages/business/business.routes').then(
            (m) => m.businessRoutes,
          ),
      },
      {
        path: '**',
        redirectTo: 'login',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
