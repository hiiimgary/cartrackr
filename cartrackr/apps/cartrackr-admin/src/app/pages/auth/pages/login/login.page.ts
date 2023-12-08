import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextInputComponent } from '../../../../shared/ui/form/text-input/text-input.component';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';
import { AlertComponent } from '../../../../shared/ui/alert/alert.component';
import { BehaviorSubject } from 'rxjs';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TextInputComponent,
    ReactiveFormsModule,
    RouterModule,
    AlertComponent,
  ],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  loginForm = inject(FormBuilder).nonNullable.group({
    email: ['admin@admin.hu', [Validators.required, Validators.email]],
  });

  errorMsg$ = new BehaviorSubject<string>('');
  isSuccess$ = new BehaviorSubject<boolean>(false);

  constructor(private readonly authService: AuthService) {}

  onLoginClick(): void {
    if (!this.loginForm.valid) {
      return;
    }

    this.authService.login$(this.loginForm.getRawValue().email).subscribe({
      next: () => {
        this.isSuccess$.next(true);
      },
      error: (err) => {
        this.errorMsg$.next(err.error.message);
      },
    });
  }
}
