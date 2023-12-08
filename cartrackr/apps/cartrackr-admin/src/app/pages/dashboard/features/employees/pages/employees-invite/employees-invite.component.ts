import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { TextInputComponent } from '../../../../../../shared/ui/form/text-input/text-input.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeesService } from '../../employees.service';
import { ActivatedRoute } from '@angular/router';
import { InputSelectComponent } from '../../../../../../shared/ui/form/input-select/input-select.component';
import { BusinessRole } from '@cartrackr/cartrackr-shared';
import { PERMISSIONS } from '../../employees.types';
import { BehaviorSubject } from 'rxjs';
import { AlertComponent } from '../../../../../../shared/ui/alert/alert.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TextInputComponent,
    ReactiveFormsModule,
    InputSelectComponent,
    AlertComponent,
  ],
  templateUrl: './employees-invite.component.html',
  styleUrls: ['./employees-invite.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeesInviteComponent {
  createForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    permission: ['', [Validators.required]],
  });

  errorMsg$ = new BehaviorSubject<string>('');

  readonly permissions = PERMISSIONS;

  constructor(
    private readonly fb: FormBuilder,
    private readonly employeesService: EmployeesService,
    private readonly location: Location,
    private readonly route: ActivatedRoute
  ) {}

  onSubmitClick(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    this.create();
  }

  private create(): void {
    this.employeesService
      .invite$(
        this.createForm.getRawValue() as {
          email: string;
          permission: BusinessRole;
        }
      )
      .subscribe({
        complete: () => {
          this.location.back();
        },
        error: (err) => {
          console.log(err);

          if (err.error.message === 'user-not-found') {
            this.errorMsg$.next('User not found');
          } else {
            this.errorMsg$.next('Something went wrong');
          }
        },
      });
  }
}
