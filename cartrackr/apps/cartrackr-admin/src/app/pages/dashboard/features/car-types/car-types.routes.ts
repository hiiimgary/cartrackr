import { Route } from '@angular/router';
import { CarDetailType } from './car-types.types';

export const carTypesRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/car-types-list/car-types-list.component').then(
        (m) => m.CarTypesListComponent
      ),
  },
  {
    path: 'create',
    data: {
      type: CarDetailType.BRAND,
      isCreate: true,
    },
    loadComponent: () =>
      import('./pages/car-types-create/car-types-create.component').then(
        (m) => m.CarTypesCreateComponent
      ),
  },
  {
    path: ':id',
    data: {
      type: CarDetailType.BRAND,
      isCreate: false,
    },
    loadComponent: () =>
      import('./pages/car-types-create/car-types-create.component').then(
        (m) => m.CarTypesCreateComponent
      ),
  },
  {
    path: ':id/categories/create',
    data: {
      type: CarDetailType.CATEGORY,
      isCreate: true,
    },
    loadComponent: () =>
      import('./pages/car-types-create/car-types-create.component').then(
        (m) => m.CarTypesCreateComponent
      ),
  },
  {
    path: ':id/categories/:categoryId',
    data: {
      type: CarDetailType.CATEGORY,
      isCreate: false,
    },
    loadComponent: () =>
      import('./pages/car-types-create/car-types-create.component').then(
        (m) => m.CarTypesCreateComponent
      ),
  },
  {
    path: ':id/categories/:categoryId/models/create',
    data: {
      type: CarDetailType.MODEL_WITH_CATEGORY,
      isCreate: true,
    },
    loadComponent: () =>
      import('./pages/car-types-create/car-types-create.component').then(
        (m) => m.CarTypesCreateComponent
      ),
  },
  {
    path: ':id/categories/:categoryId/models/:modelId',
    data: {
      type: CarDetailType.MODEL_WITH_CATEGORY,
      isCreate: false,
    },
    loadComponent: () =>
      import('./pages/car-types-create/car-types-create.component').then(
        (m) => m.CarTypesCreateComponent
      ),
  },
  {
    path: ':id/models/create',
    data: {
      type: CarDetailType.MODEL,
      isCreate: true,
    },
    loadComponent: () =>
      import('./pages/car-types-create/car-types-create.component').then(
        (m) => m.CarTypesCreateComponent
      ),
  },
  {
    path: ':id/models/:modelId',
    data: {
      type: CarDetailType.MODEL,
      isCreate: false,
    },
    loadComponent: () =>
      import('./pages/car-types-create/car-types-create.component').then(
        (m) => m.CarTypesCreateComponent
      ),
  },
];
