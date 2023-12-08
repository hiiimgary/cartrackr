import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateBusiness } from '../types/create-business.types';

@Injectable({
  providedIn: 'root',
})
export class BusinessSelectorService {
  constructor(private readonly http: HttpClient) {}

  createBusiness$(payload: CreateBusiness): Observable<unknown> {
    return this.http.post<unknown>('business', payload);
  }
}
