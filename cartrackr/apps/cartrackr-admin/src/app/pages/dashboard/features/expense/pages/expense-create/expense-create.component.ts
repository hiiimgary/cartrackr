import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { TextInputComponent } from '../../../../../../shared/ui/form/text-input/text-input.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExpenseService } from '../../expense.service';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, map, switchMap } from 'rxjs';
import { Expense } from '../../expense.types';

@Component({
  standalone: true,
  imports: [CommonModule, TextInputComponent, ReactiveFormsModule],
  templateUrl: './expense-create.component.html',
  styleUrls: ['./expense-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpenseCreateComponent {
  createForm = this.fb.nonNullable.group({
    slug: ['', [Validators.required]],
    name: ['', [Validators.required]],
  });

  detail$ = this.route.params.pipe(
    map((params) => params['id']),
    switchMap((id) => {
      if (!id) {
        return EMPTY;
      }
      return this.expenseService.fetchDetail$(id);
    }),
    map((expense) => {
      this.createForm.patchValue(
        Object.keys(expense).reduce<{ [key: string]: unknown }>((acc, key) => {
          if (!this.createForm.contains(key)) {
            return acc;
          }
          acc[key] = expense[key as keyof Expense];
          return acc;
        }, {})
      );
    })
  );

  constructor(
    private readonly fb: FormBuilder,
    private readonly expenseService: ExpenseService,
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
    this.expenseService.create$(this.createForm.getRawValue()).subscribe(() => {
      this.location.back();
    });
  }

  private update(id: string): void {
    this.expenseService
      .update$(id, this.createForm.getRawValue())
      .subscribe(() => {
        this.location.back();
      });
  }
}
