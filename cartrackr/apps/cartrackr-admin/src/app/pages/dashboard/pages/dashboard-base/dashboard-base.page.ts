import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../ui/header/header.component';
import { NavComponent } from '../../ui/nav/nav.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { map } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, HeaderComponent, NavComponent, RouterModule],
  templateUrl: './dashboard-base.page.html',
  styleUrls: ['./dashboard-base.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardBasePage {
  navItems$ = this.route.data.pipe(map((data) => data['navItems']));

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  onLogoutClick(): void {
    this.authService.logout$().subscribe(() => {
      this.router.navigate(['/auth']);
    });
  }
}
