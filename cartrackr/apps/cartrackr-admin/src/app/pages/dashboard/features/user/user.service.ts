import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from './user.types';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private readonly http: HttpClient) {}

  fetchList$(): Observable<User[]> {
    return this.http.get<User[]>('users');
  }

  fetchDetail$(id: string): Observable<User> {
    return this.http.get<User>(`users/${id}`);
  }

  create$(data: Partial<User>): Observable<User> {
    return this.http.post<User>('users', data);
  }

  update$(id: string, data: Partial<User>): Observable<User> {
    return this.http.post<User>(`users/${id}`, data);
  }

  delete$(id: number): Observable<unknown> {
    return this.http.delete<User>(`users/${id}`);
  }
}
