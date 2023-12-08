import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { of, tap } from 'rxjs';
import { InputGalleryComponent } from 'src/app/shared/ui/form/input-gallery/input-gallery.component';
import { InputLicensePlateComponent } from 'src/app/shared/ui/form/input-license-plate/input-license-plate.component';
import { InputSelectComponent } from 'src/app/shared/ui/form/input-select/input-select.component';
import { LoadingComponent } from 'src/app/shared/ui/loading/loading.component';
import { Store } from '@ngrx/store';
import {
  selectAddExpenseIsLoading,
  selectExpenseCategories,
} from '../../../../store/car.selectors';
import { InputDateComponent } from 'src/app/shared/ui/form/input-date/input-date.component';
import { InputTextComponent } from 'src/app/shared/ui/form/input-text/input-text.component';
import { InputNumberComponent } from 'src/app/shared/ui/form/input-number/input-number.component';
import { InputToggleComponent } from 'src/app/shared/ui/form/input-toggle/input-toggle.component';
import { CarActions } from '../../../../store/car.actions';
import { IONIC_COMPONENTS } from 'src/app/shared/utils/ionic-components';

export const ADD_EXPENSE_MODAL_ID = 'ADD_EXPENSE_MODAL_ID';

@Component({
  selector: 'app-create-expense',
  templateUrl: './create-expense.page.html',
  styleUrls: ['./create-expense.page.scss'],
  standalone: true,
  imports: [
    ...IONIC_COMPONENTS,
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    LoadingComponent,
    InputGalleryComponent,
    InputLicensePlateComponent,
    InputSelectComponent,
    InputDateComponent,
    InputTextComponent,
    InputNumberComponent,
    InputToggleComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateExpensePage {
  @Input({ required: true }) carId!: number;

  createForm = this.fb.group({
    date: [new Date(), [Validators.required]],
    price: [null, [Validators.required]],
    title: [null, [Validators.required]],
    expenseCategoryId: ['', [Validators.required]],
  });

  isLoading$ = this.store.select(selectAddExpenseIsLoading);

  expenseCategoriesSignal = this.store.selectSignal(selectExpenseCategories);

  refillForm = this.fb.group({
    amount: [null, [Validators.required]],
    mileage: [null, [Validators.required]],
    isFull: [false, [Validators.required]],
  });

  readonly expenseTypeListener$ = this.createForm.controls[
    'expenseCategoryId'
  ].valueChanges.pipe(
    tap((slug) => {
      if (slug === 'refill') {
        this.createForm.addControl('refill', this.refillForm);
      } else {
        this.createForm.removeControl('refill');
      }
    }),
  );

  constructor(
    private readonly modalCtrl: ModalController,
    private readonly fb: UntypedFormBuilder,
    private readonly store: Store,
  ) {}

  onCloseClick(): void {
    this.modalCtrl.dismiss();
  }

  onSubmitClick(): void {
    if (!this.createForm.valid) {
      this.createForm.markAllAsTouched();
      return;
    }

    const payload = this.createForm.getRawValue();
    this.store.dispatch(
      CarActions.createExpense({ expense: payload, carId: this.carId }),
    );
  }
}
