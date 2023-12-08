import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { TextInputComponent } from '../../../../../../shared/ui/form/text-input/text-input.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeesService } from '../../employees.service';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, map, switchMap } from 'rxjs';
import { Employees, PERMISSIONS } from '../../employees.types';
import { InputSelectComponent } from '../../../../../../shared/ui/form/input-select/input-select.component';
import { BusinessRole } from '@cartrackr/cartrackr-shared';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TextInputComponent,
    ReactiveFormsModule,
    InputSelectComponent,
  ],
  templateUrl: './employees-create.component.html',
  styleUrls: ['./employees-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeesCreateComponent {
  createForm = this.fb.nonNullable.group({
    email: ['', [Validators.required]],
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    permission: ['', [Validators.required]],
  });

  detail$ = this.route.params.pipe(
    map((params) => params['id']),
    switchMap((id) => {
      if (!id) {
        return EMPTY;
      }
      return this.employeesService.fetchDetail$(id);
    }),
    map((employees) => {
      this.createForm.patchValue(
        Object.keys(employees).reduce<{ [key: string]: unknown }>(
          (acc, key) => {
            if (!this.createForm.contains(key)) {
              return acc;
            }
            acc[key] = employees[key as keyof Employees];
            return acc;
          },
          {}
        )
      );
      this.createForm.controls['email'].disable();
      this.createForm.controls['firstName'].disable();
      this.createForm.controls['lastName'].disable();
      if (employees.permission === BusinessRole.OWNER) {
        this.createForm.controls['permission'].disable();
      }
    })
  );

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

    const id = this.route.snapshot.params['id'];

    this.update(id);
  }

  private update(id: string): void {
    this.employeesService
      .update$(id, this.createForm.getRawValue().permission as BusinessRole)
      .subscribe(() => {
        this.location.back();
      });
  }
}
