import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingComponent } from 'src/app/shared/ui/loading/loading.component';
import { of } from 'rxjs';
import { InputTextComponent } from 'src/app/shared/ui/form/input-text/input-text.component';
import { InputDateComponent } from 'src/app/shared/ui/form/input-date/input-date.component';
import { Store } from '@ngrx/store';
import { CarActions } from '../../../../store/car.actions';
import { IONIC_COMPONENTS } from 'src/app/shared/utils/ionic-components';

export const ADD_DEADLINE_MODAL_ID = 'ADD_DEADLINE_MODAL_ID';

@Component({
  selector: 'app-create-deadline',
  templateUrl: './create-deadline.page.html',
  styleUrls: ['./create-deadline.page.scss'],
  standalone: true,
  imports: [
    ...IONIC_COMPONENTS,
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    LoadingComponent,
    InputTextComponent,
    InputDateComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateDeadlinePage {
  createForm = this.fb.nonNullable.group({
    title: ['', [Validators.required]],
    deadline: [new Date()],
  });

  @Input({ required: true }) carId!: number;

  isLoading$ = of(false);

  constructor(
    private readonly modalCtrl: ModalController,
    private readonly fb: FormBuilder,
    private readonly store: Store,
  ) {}

  onCloseClick(): void {
    this.modalCtrl.dismiss();
  }

  onSubmitClick(): void {
    console.log(this.createForm);

    if (!this.createForm.valid) {
      this.createForm.markAllAsTouched();
      return;
    }

    const payload = this.createForm.getRawValue();
    this.store.dispatch(
      CarActions.createDeadline({ carId: this.carId, deadline: payload }),
    );
  }
}
