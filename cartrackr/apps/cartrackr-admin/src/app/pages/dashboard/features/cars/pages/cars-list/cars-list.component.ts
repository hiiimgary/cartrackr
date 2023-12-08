import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarsService } from '../../cars.service';
import { DetailHeaderComponent } from '../../../../ui/detail-header/detail-header.component';
import { tableComponentImports } from '@cartrackr/ng-table';
import { RouterModule } from '@angular/router';
import { Subject, map, startWith, switchMap } from 'rxjs';
import { Car } from '../../cars.types';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    DetailHeaderComponent,
    ...tableComponentImports,
    RouterModule,
  ],
  templateUrl: './cars-list.component.html',
  styleUrls: ['./cars-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarsListComponent {
  private refreshSubject = new Subject<void>();
  private filterSubject = new Subject<string>();

  readonly propsToFilter: (keyof Car)[] = ['licensePlate', 'brand', 'model'];

  list$ = this.refreshSubject.asObservable().pipe(
    map(() => null),
    startWith(null),
    switchMap(() => this.carsService.fetchList$()),
    switchMap((list) => {
      return this.filterSubject.asObservable().pipe(
        startWith(''),
        map((filter) => {
          if (!filter) {
            return list;
          }
          return list.filter((item) => {
            return this.propsToFilter.reduce((acc, key) => {
              if (acc) {
                return true;
              }
              return `${item[key]}`
                .toLowerCase()
                .includes(filter.toLowerCase());
            }, false);
          });
        })
      );
    })
  );

  constructor(private readonly carsService: CarsService) {}

  onDelete(id: number): void {
    this.carsService.delete$(id).subscribe(() => {
      this.refreshSubject.next();
    });
  }

  onFilter(value: string): void {
    this.filterSubject.next(value);
  }
}
