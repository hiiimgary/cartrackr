import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { RefillStation } from './refill-station.types';

@Injectable({
  providedIn: 'root',
})
export class RefillStationService {
  constructor(private readonly http: HttpClient) {}

  fetchList$(): Observable<RefillStation[]> {
    return this.http.get<RefillStation[]>('refill-stations');
  }

  fetchDetail$(id: string): Observable<RefillStation> {
    return this.http.get<RefillStation>(`refill-stations/${id}`);
  }

  create$(data: Omit<RefillStation, 'id'>): Observable<RefillStation> {
    return this.http.post<RefillStation>('refill-stations', data);
  }

  update$(id: string, data: Partial<RefillStation>): Observable<RefillStation> {
    return this.http.post<RefillStation>(`refill-stations/${id}`, data);
  }

  delete$(id: number): Observable<unknown> {
    return this.http.delete<RefillStation>(`refill-stations/${id}`);
  }
}
