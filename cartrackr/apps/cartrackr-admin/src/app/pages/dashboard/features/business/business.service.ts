import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BusinessDetail, BusinessListItem } from './business.types';

@Injectable({
  providedIn: 'root',
})
export class BusinessService {
  constructor(private readonly http: HttpClient) {}

  fetchList$(): Observable<BusinessListItem[]> {
    return this.http.get<BusinessListItem[]>('business');
  }

  fetchDetail$(id: string): Observable<BusinessDetail> {
    return this.http.get<BusinessDetail>(`business/${id}`);
  }

  update$(
    id: string,
    data: Partial<BusinessDetail>
  ): Observable<BusinessDetail> {
    return this.http.post<BusinessDetail>(`business/${id}`, data);
  }

  activate$(id: number): Observable<BusinessDetail> {
    return this.http.post<BusinessDetail>(`business/${id}/activate`, {});
  }

  delete$(id: number): Observable<unknown> {
    return this.http.delete<BusinessDetail>(`business/${id}`);
  }
}
