import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../alert.service';
import { DetailHeaderComponent } from '../../../../ui/detail-header/detail-header.component';
import { tableComponentImports } from '@cartrackr/ng-table';
import { RouterModule } from '@angular/router';
import { Subject, map, startWith, switchMap } from 'rxjs';
import { Alert } from '../../alert.types';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    DetailHeaderComponent,
    ...tableComponentImports,
    RouterModule,
  ],
  templateUrl: './alert-list.component.html',
  styleUrls: ['./alert-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertListComponent {
  private refreshSubject = new Subject<void>();
  private filterSubject = new Subject<string>();

  readonly propsToFilter: (keyof Alert)[] = ['title', 'id'];

  list$ = this.refreshSubject.asObservable().pipe(
    map(() => null),
    startWith(null),
    switchMap(() => this.alertService.fetchList$()),
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

  constructor(private readonly alertService: AlertService) {}

  onDelete(id: number): void {
    this.alertService.delete$(id).subscribe(() => {
      this.refreshSubject.next();
    });
  }

  onFilter(value: string): void {
    this.filterSubject.next(value);
  }
}
