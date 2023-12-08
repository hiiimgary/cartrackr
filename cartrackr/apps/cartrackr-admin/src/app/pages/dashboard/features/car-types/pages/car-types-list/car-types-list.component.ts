import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarTypesService } from '../../car-types.service';
import { DetailHeaderComponent } from '../../../../ui/detail-header/detail-header.component';
import { tableComponentImports } from '@cartrackr/ng-table';
import { RouterModule } from '@angular/router';
import { Subject, map, startWith, switchMap } from 'rxjs';
import { CarBrand } from '@cartrackr/cartrackr-shared';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    DetailHeaderComponent,
    ...tableComponentImports,
    RouterModule,
  ],
  templateUrl: './car-types-list.component.html',
  styleUrls: ['./car-types-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarTypesListComponent {
  private refreshSubject = new Subject<void>();
  private filterSubject = new Subject<string>();

  readonly propsToFilter: (keyof CarBrand)[] = ['name', 'id'];

  list$ = this.refreshSubject.asObservable().pipe(
    map(() => null),
    startWith(null),
    switchMap(() => this.carTypesService.fetchList$()),
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

  constructor(private readonly carTypesService: CarTypesService) {}

  onDelete(id: number): void {
    this.carTypesService.deleteBrand$(id).subscribe(() => {
      this.refreshSubject.next();
    });
  }

  onFilter(value: string): void {
    this.filterSubject.next(value);
  }
}
