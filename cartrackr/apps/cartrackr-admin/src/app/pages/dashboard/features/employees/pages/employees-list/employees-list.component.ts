import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeesService } from '../../employees.service';
import { DetailHeaderComponent } from '../../../../ui/detail-header/detail-header.component';
import { tableComponentImports } from '@cartrackr/ng-table';
import { RouterModule } from '@angular/router';
import { Subject, map, startWith, switchMap } from 'rxjs';
import { Employees } from '../../employees.types';
import { AuthService } from '../../../../../auth/services/auth.service';
import { BusinessRole } from '@cartrackr/cartrackr-shared';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    DetailHeaderComponent,
    ...tableComponentImports,
    RouterModule,
  ],
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeesListComponent {
  private refreshSubject = new Subject<void>();
  private filterSubject = new Subject<string>();

  readonly propsToFilter: (keyof Employees)[] = [
    'firstName',
    'email',
    'lastName',
    'id',
  ];

  permission = BusinessRole;

  userId$ = this.authService.userData$.pipe(
    map((userData) => userData?.user.id)
  );

  list$ = this.refreshSubject.asObservable().pipe(
    map(() => null),
    startWith(null),
    switchMap(() => this.employeesService.fetchList$()),
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

  constructor(
    private readonly employeesService: EmployeesService,
    private readonly authService: AuthService
  ) {}

  onDelete(id: number): void {
    this.employeesService.delete$(id).subscribe(() => {
      this.refreshSubject.next();
    });
  }

  onFilter(value: string): void {
    this.filterSubject.next(value);
  }
}
