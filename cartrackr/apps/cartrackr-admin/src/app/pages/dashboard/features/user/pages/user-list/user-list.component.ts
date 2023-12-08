import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../user.service';
import { DetailHeaderComponent } from '../../../../ui/detail-header/detail-header.component';
import { tableComponentImports } from '@cartrackr/ng-table';
import { RouterModule } from '@angular/router';
import { Subject, map, startWith, switchMap } from 'rxjs';
import { User } from '../../user.types';
import { AuthService } from '../../../../../auth/services/auth.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    DetailHeaderComponent,
    ...tableComponentImports,
    RouterModule,
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent {
  private refreshSubject = new Subject<void>();
  private filterSubject = new Subject<string>();

  readonly propsToFilter: (keyof User)[] = [
    'firstName',
    'id',
    'lastName',
    'email',
  ];

  list$ = this.refreshSubject.asObservable().pipe(
    map(() => null),
    startWith(null),
    switchMap(() => this.userService.fetchList$()),
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

  userId$ = this.authService.userData$.pipe(
    map((userData) => userData?.user.id)
  );

  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}

  onDelete(id: number): void {
    this.userService.delete$(id).subscribe(() => {
      this.refreshSubject.next();
    });
  }

  onBlock(id: number): void {
    this.userService.update$(`${id}`, { isBlocked: true }).subscribe(() => {
      this.refreshSubject.next();
    });
  }

  onUnblock(id: number): void {
    this.userService.update$(`${id}`, { isBlocked: false }).subscribe(() => {
      this.refreshSubject.next();
    });
  }

  onFilter(value: string): void {
    this.filterSubject.next(value);
  }
}
