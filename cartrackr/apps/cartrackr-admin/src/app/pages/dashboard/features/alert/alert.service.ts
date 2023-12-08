import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Alert } from './alert.types';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(private readonly http: HttpClient) {}

  fetchList$(): Observable<Alert[]> {
    return this.http.get<Alert[]>('alerts');
  }

  fetchDetail$(id: string): Observable<Alert> {
    return this.http.get<Alert>(`alerts/${id}`);
  }

  create$(data: Omit<Alert, 'id'>): Observable<Alert> {
    return this.http.post<Alert>('alerts', data);
  }

  update$(id: string, data: Partial<Alert>): Observable<Alert> {
    return this.http.post<Alert>(`alerts/${id}`, data);
  }

  delete$(id: number): Observable<unknown> {
    return this.http.delete<Alert>(`alerts/${id}`);
  }
}
