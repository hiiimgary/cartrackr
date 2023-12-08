import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { InputLicensePlateComponent } from 'src/app/shared/ui/form/input-license-plate/input-license-plate.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { of } from 'rxjs';
import { LoadingComponent } from 'src/app/shared/ui/loading/loading.component';
import { Store } from '@ngrx/store';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonRadio,
  IonRadioGroup,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { selectAlertCategories } from '../car/store/car.selectors';
import { InputRadioComponent } from 'src/app/shared/ui/form/input-radio/input-radio.component';
import { AlertActions } from './store/alert.actions';
import { selectAlertIsLoading } from './store/alert.selectors';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.page.html',
  styleUrls: ['./alert.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonListHeader,
    IonLabel,
    IonList,
    IonItem,
    IonRadio,
    IonButton,
    IonRadioGroup,
    TranslateModule,
    InputLicensePlateComponent,
    ReactiveFormsModule,
    LoadingComponent,
    InputRadioComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertPage {
  alertForm = this.fb.nonNullable.group({
    licensePlate: ['', [Validators.required]],
    reason: ['', [Validators.required]],
  });

  isLoading$ = this.store.select(selectAlertIsLoading);

  alertCategoriesSignal = this.store.selectSignal(selectAlertCategories);

  constructor(
    private readonly fb: FormBuilder,
    private readonly store: Store,
    private readonly cd: ChangeDetectorRef,
  ) {}

  onSubmitClick(): void {
    if (!this.alertForm.valid) {
      this.alertForm.markAllAsTouched();
      return;
    }

    const payload = this.alertForm.getRawValue();

    console.log(payload);

    this.store.dispatch(
      AlertActions.alertDriver({
        licensePlate: payload.licensePlate,
        reason: parseInt(payload.reason),
      }),
    );
    this.alertForm.setValue({ licensePlate: '', reason: '' });
  }
}
