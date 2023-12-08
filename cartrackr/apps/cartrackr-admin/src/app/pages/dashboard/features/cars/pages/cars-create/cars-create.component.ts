import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { TextInputComponent } from '../../../../../../shared/ui/form/text-input/text-input.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CarsService } from '../../cars.service';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, map, switchMap, tap } from 'rxjs';
import { InputToggleComponent } from '../../../../../../shared/ui/form/input-toggle/input-toggle.component';
import { AuthService } from '../../../../../auth/services/auth.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TextInputComponent,
    InputToggleComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './cars-create.component.html',
  styleUrls: ['./cars-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarsCreateComponent {
  createForm = this.fb.nonNullable.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    price: [0, [Validators.required]],
    isFinalized: [false, [Validators.required]],
  });

  editableExpenseId!: number;

  detail$ = this.route.params.pipe(
    map((params) => params['id']),
    switchMap((id) => {
      if (!id) {
        return EMPTY;
      }
      return this.carsService.fetchDetail$(id);
    }),
    map((car) => {
      const editableEntry = car.serviceEntries.find(
        (entry) => entry.isEditable
      );
      if (!editableEntry) {
        return;
      }
      this.editableExpenseId = editableEntry.expenseId;
      this.createForm.patchValue(
        {
          title: editableEntry.title,
          description: editableEntry.description,
          price: editableEntry.price,
          isFinalized: editableEntry.isFinalized,
        },
        { emitEvent: false }
      );
      return {
        ...car,
        serviceEntries: car.serviceEntries.filter((entry) => !entry.isEditable),
      };
    })
  );

  constructor(
    private readonly fb: FormBuilder,
    private readonly carsService: CarsService,
    private readonly location: Location,
    private readonly route: ActivatedRoute,
    private readonly authService: AuthService
  ) {}

  onSubmitClick(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    this.update(this.editableExpenseId);
  }

  private update(id: number): void {
    this.carsService
      .update$(id, this.createForm.getRawValue())
      .subscribe(() => {
        this.location.back();
      });
  }
}
