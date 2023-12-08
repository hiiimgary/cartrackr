import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { List } from 'src/app/shared/types/list.types';

@Injectable({
  providedIn: 'root',
})
export class MapsService {
  constructor(private readonly http: HttpClient) {}

  fetchLocations$(): Observable<List<any>> {
    return this.http.get<List<any>>('locations').pipe(
      tap((res) => {
        console.log(res);
      })
    );
  }
}
