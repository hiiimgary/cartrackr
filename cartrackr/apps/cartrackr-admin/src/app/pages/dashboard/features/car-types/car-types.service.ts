import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  CarBrand,
  CarModel,
  CarModelCategory,
} from '@cartrackr/cartrackr-shared';
import { DetailIds } from './car-types.types';

@Injectable({
  providedIn: 'root',
})
export class CarTypesService {
  constructor(private readonly http: HttpClient) {}

  // BRAND
  fetchList$(): Observable<CarBrand[]> {
    return this.http.get<CarBrand[]>('cars/brands');
  }

  fetchBrandDetail$(ids: DetailIds): Observable<CarBrand> {
    return this.http.get<CarBrand>(`cars/brands/${ids.brandId}`);
  }

  createBrand$(data: { name: string }): Observable<CarBrand> {
    return this.http.post<CarBrand>('cars/brands', data);
  }

  updateBrand$(ids: DetailIds, data: Partial<CarBrand>): Observable<CarBrand> {
    return this.http.post<CarBrand>(`cars/brands/${ids.brandId}`, data);
  }

  deleteBrand$(id: number): Observable<unknown> {
    return this.http.delete<CarBrand>(`cars/brands/${id}`);
  }

  // CATEGORY
  fetchCategoryDetail$(ids: DetailIds): Observable<CarModelCategory> {
    return this.http.get<CarModelCategory>(
      `cars/brands/${ids.brandId}/categories/${ids.categoryId}`
    );
  }

  createCategory$(
    data: { name: string },
    ids: DetailIds
  ): Observable<CarModelCategory> {
    return this.http.post<CarModelCategory>(
      `cars/brands/${ids.brandId}/categories/create`,
      data
    );
  }

  updateCategory$(
    ids: DetailIds,
    data: Partial<CarModelCategory>
  ): Observable<CarModelCategory> {
    return this.http.post<CarModelCategory>(
      `cars/brands/${ids.brandId}/categories/${ids.categoryId}`,
      data
    );
  }

  deleteCategory$(ids: DetailIds): Observable<unknown> {
    return this.http.delete<CarModelCategory>(
      `cars/brands/${ids.brandId}/categories/${ids.categoryId}`
    );
  }

  // MODEL WITH CATEGORY
  fetchModelWithCategoryDetail$(ids: DetailIds): Observable<CarModel> {
    return this.http.get<CarModel>(
      `cars/brands/${ids.brandId}/categories/${ids.categoryId}/models/${ids.modelId}`
    );
  }

  createModelWithCategory$(
    data: { name: string },
    ids: DetailIds
  ): Observable<CarModel> {
    return this.http.post<CarModel>(
      `cars/brands/${ids.brandId}/categories/${ids.categoryId}/models/create`,
      data
    );
  }

  updateModelWithCategory$(
    ids: DetailIds,
    data: Partial<CarModel>
  ): Observable<CarModel> {
    return this.http.post<CarModel>(
      `cars/brands/${ids.brandId}/categories/${ids.categoryId}/models/${ids.modelId}`,
      data
    );
  }

  deleteModelWithCategory$(ids: DetailIds): Observable<unknown> {
    return this.http.delete<CarModel>(
      `cars/brands/${ids.brandId}/categories/${ids.categoryId}/models/${ids.modelId}`
    );
  }

  // MODEL
  fetchModelDetail$(ids: DetailIds): Observable<CarModel> {
    return this.http.get<CarModel>(
      `cars/brands/${ids.brandId}/models/${ids.modelId}`
    );
  }

  createModel$(data: { name: string }, ids: DetailIds): Observable<CarModel> {
    return this.http.post<CarModel>(
      `cars/brands/${ids.brandId}/models/create`,
      data
    );
  }

  updateModel$(ids: DetailIds, data: Partial<CarModel>): Observable<CarModel> {
    return this.http.post<CarModel>(
      `cars/brands/${ids.brandId}/models/${ids.modelId}`,
      data
    );
  }

  deleteModel$(ids: DetailIds): Observable<unknown> {
    return this.http.delete<CarModel>(
      `cars/brands/${ids.brandId}/models/${ids.modelId}`
    );
  }
}
