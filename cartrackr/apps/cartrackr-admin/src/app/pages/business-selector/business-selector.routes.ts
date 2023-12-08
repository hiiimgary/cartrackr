import { Route } from '@angular/router';
import { BusinessSelectorBasePage } from './pages/business-selector-base/business-selector-base.page';

export const businessSelectorRoutes: Route[] = [
  {
    path: '',
    component: BusinessSelectorBasePage,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/businesses-list/businesses-list.page').then(
            (m) => m.BusinessesListPage
          ),
      },
      {
        path: 'create-business',
        loadComponent: () =>
          import('./pages/create-business/create-business.page').then(
            (m) => m.CreateBusinessPage
          ),
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
];
