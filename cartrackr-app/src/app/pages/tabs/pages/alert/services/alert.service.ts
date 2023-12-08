import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(private readonly http: HttpClient) {}

  alertDriver$(licensePlate: string, reason: number) {
    return this.http.post('cars/alert-driver', { licensePlate, reason });
  }
}
