import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Expense } from './expense.types';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  constructor(private readonly http: HttpClient) {}

  fetchList$(): Observable<Expense[]> {
    return this.http.get<Expense[]>('expense-categories');
  }

  fetchDetail$(id: string): Observable<Expense> {
    return this.http.get<Expense>(`expense-categories/${id}`);
  }

  create$(data: Omit<Expense, 'id'>): Observable<Expense> {
    return this.http.post<Expense>('expense-categories', data);
  }

  update$(id: string, data: Partial<Expense>): Observable<Expense> {
    return this.http.post<Expense>(`expense-categories/${id}`, data);
  }

  delete$(id: number): Observable<unknown> {
    return this.http.delete<Expense>(`expense-categories/${id}`);
  }
}
