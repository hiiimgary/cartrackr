import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { TextInputComponent } from '../../../../../../shared/ui/form/text-input/text-input.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../user.service';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, map, switchMap } from 'rxjs';
import { User } from '../../user.types';
import { InputToggleComponent } from '../../../../../../shared/ui/form/input-toggle/input-toggle.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TextInputComponent,
    ReactiveFormsModule,
    InputToggleComponent,
  ],
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCreateComponent {
  createForm = this.fb.nonNullable.group({
    email: ['', [Validators.required]],
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    isAdmin: [false, [Validators.required]],
  });

  detail$ = this.route.params.pipe(
    map((params) => params['id']),
    switchMap((id) => {
      if (!id) {
        return EMPTY;
      }
      return this.userService.fetchDetail$(id);
    }),
    map((user) => {
      this.createForm.patchValue(
        Object.keys(user).reduce<{ [key: string]: unknown }>((acc, key) => {
          if (!this.createForm.contains(key)) {
            return acc;
          }
          acc[key] = user[key as keyof User];
          return acc;
        }, {})
      );
    })
  );

  constructor(
    private readonly fb: FormBuilder,
    private readonly userService: UserService,
    private readonly location: Location,
    private readonly route: ActivatedRoute
  ) {}

  onSubmitClick(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    const id = this.route.snapshot.params['id'];

    id ? this.update(id) : this.create();
  }

  private create(): void {
    this.userService.create$(this.createForm.getRawValue()).subscribe(() => {
      this.location.back();
    });
  }

  private update(id: string): void {
    this.userService
      .update$(id, this.createForm.getRawValue())
      .subscribe(() => {
        this.location.back();
      });
  }
}
