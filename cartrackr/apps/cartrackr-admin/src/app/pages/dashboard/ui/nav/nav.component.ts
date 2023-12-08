import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavItem } from './nav.types';
import { List } from '../../../../shared/types/list.types';
import { RouterModule } from '@angular/router';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';
import { IsAdminDirective } from '../../../../core/directives/is-admin.directive';
import { AuthService } from '../../../auth/services/auth.service';
import { BehaviorSubject, combineLatest, map } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-nav',
  imports: [CommonModule, RouterModule, IconComponent, IsAdminDirective],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavComponent {
  @Input({ required: true }) set navItems(value: List<NavItem>) {
    this.navItems$.next(value);
  }

  private readonly navItems$ = new BehaviorSubject<List<NavItem>>([]);

  list$ = combineLatest([
    this.navItems$,
    this.authService.userData$.pipe(
      map((userData) => {
        return userData?.user.isAdmin;
      })
    ),
  ]).pipe(
    map(([navItems, isAdmin]) => {
      return navItems.filter((navItem) => {
        if (navItem.admin === undefined) {
          return true;
        }

        return navItem.admin === isAdmin;
      });
    })
  );

  constructor(private readonly authService: AuthService) {}
}
