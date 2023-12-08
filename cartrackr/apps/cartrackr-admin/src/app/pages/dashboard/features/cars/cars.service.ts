import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Car, CarDetail } from './cars.types';
import { BusinessCarServiceEntry } from '@cartrackr/cartrackr-shared';

@Injectable({
  providedIn: 'root',
})
export class CarsService {
  constructor(private readonly http: HttpClient) {}

  fetchList$(): Observable<Car[]> {
    return this.http.get<Car[]>('business-cars');
  }

  fetchDetail$(id: string): Observable<CarDetail> {
    return this.http.get<CarDetail>(`business-cars/${id}`);
  }

  update$(id: number, data: Partial<BusinessCarServiceEntry>): Observable<Car> {
    return this.http.post<Car>(`business-cars/${id}`, data);
  }

  notify$(id: number, data: { title: string }): Observable<unknown> {
    return this.http.post(`business-cars/${id}/notify`, data);
  }

  delete$(id: number): Observable<unknown> {
    return this.http.delete<Car>(`business-cars/${id}`);
  }
}
