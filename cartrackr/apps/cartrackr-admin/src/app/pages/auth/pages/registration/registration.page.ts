import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TextInputComponent } from '../../../../shared/ui/form/text-input/text-input.component';
import { AuthService } from '../../services/auth.service';
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
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationPage {
  registrationForm = inject(FormBuilder).nonNullable.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
  });

  errorMsg$ = new BehaviorSubject<string>('');
  isSuccess$ = new BehaviorSubject<boolean>(false);

  constructor(private readonly authService: AuthService) {}

  onRegistrationClick(): void {
    if (!this.registrationForm.valid) {
      return;
    }
    this.errorMsg$.next('');

    this.authService.register$(this.registrationForm.getRawValue()).subscribe({
      next: () => {
        this.isSuccess$.next(true);
      },
      error: (err) => {
        console.log(err.error.message);

        this.errorMsg$.next(err.error.message);
      },
    });
  }
}
