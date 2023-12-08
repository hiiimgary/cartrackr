import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, catchError, delay, map, of, switchMap, tap } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login-verification.page.html',
  styleUrls: ['./login-verification.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginVerificationPage {
  loginState$: Observable<{ success: boolean }> = this.route.queryParams.pipe(
    map((params) => params['token']),
    switchMap((token: string) => this.authService.verifyLogin$(token)),
    delay(1500),
    tap(() => this.router.navigate(['/', 'dashboard'])),
    map(() => ({ success: true })),
    catchError(() => of({ success: false })),
    delay(1500)
  );

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly authService: AuthService
  ) {}
}
