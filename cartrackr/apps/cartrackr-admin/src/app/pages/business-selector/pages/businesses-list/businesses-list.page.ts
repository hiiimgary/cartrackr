import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { map } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, IconComponent, RouterModule],
  templateUrl: './businesses-list.page.html',
  styleUrls: ['./businesses-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BusinessesListPage {
  businesses$ = this.authService.userData$.pipe(
    map((userData) => userData?.businesses || [])
  );

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  onSelectBusinessClick(businessId: number) {
    this.authService.selectBusiness$(businessId).subscribe({
      next: () => {
        console.log('asd');

        this.router.navigate(['/', 'dashboard']);
      },
    });
  }

  onLogoutClick(): void {
    this.authService.logout$().subscribe(() => {
      this.router.navigate(['/auth']);
    });
  }
}
