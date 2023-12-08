import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Employees } from './employees.types';
import { BusinessRole } from '@cartrackr/cartrackr-shared';

@Injectable({
  providedIn: 'root',
})
export class EmployeesService {
  constructor(private readonly http: HttpClient) {}

  fetchList$(): Observable<Employees[]> {
    return this.http.get<Employees[]>('user-businesses');
  }

  fetchDetail$(id: string): Observable<Employees> {
    return this.http.get<Employees>(`user-businesses/${id}`);
  }

  invite$(data: {
    email: string;
    permission: BusinessRole;
  }): Observable<unknown> {
    return this.http.post<unknown>('user-businesses/invite', data);
  }

  update$(id: string, permission: BusinessRole): Observable<Employees> {
    return this.http.post<Employees>(`user-businesses/${id}`, { permission });
  }

  delete$(id: number): Observable<unknown> {
    return this.http.delete<Employees>(`user-businesses/${id}`);
  }
}
