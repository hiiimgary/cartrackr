import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { LoadingComponent } from 'src/app/shared/ui/loading/loading.component';
import { InputGalleryComponent } from 'src/app/shared/ui/form/input-gallery/input-gallery.component';
import { InputLicensePlateComponent } from 'src/app/shared/ui/form/input-license-plate/input-license-plate.component';
import { InputSelectComponent } from 'src/app/shared/ui/form/input-select/input-select.component';
import { SelectOption } from 'src/app/shared/types/select.types';
import { List } from 'src/app/shared/types/list.types';
import { InputCarTypeComponent } from 'src/app/shared/ui/form/input-car-type/input-car-type.component';
import { Store } from '@ngrx/store';
import { selectCarBrands } from '../../store/car.selectors';
import { CarActions } from '../../store/car.actions';
import { CarType } from 'src/app/shared/ui/form/input-car-type/car-type.types';
import { IONIC_COMPONENTS } from 'src/app/shared/utils/ionic-components';

export const ADD_CAR_MODAL_ID = 'add-car-modal';

@Component({
  selector: 'app-create-car',
  templateUrl: './create-car.page.html',
  styleUrls: ['./create-car.page.scss'],
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
    InputCarTypeComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateCarPage {
  createForm = this.fb.nonNullable.group({
    licensePlate: ['', [Validators.required]],
    carType: [null, [Validators.required]],
    fuelType: [null, [Validators.required]],
    images: [[]],
  });

  isLoading$ = of(false);

  carBrandsSignal = this.store.selectSignal(selectCarBrands);

  fuelTypeOptions: List<SelectOption> = [
    { key: 1, value: 'Gasoline' },
    { key: 2, value: 'Diesel' },
    { key: 3, value: 'Electric' },
  ];

  constructor(
    private readonly modalCtrl: ModalController,
    private readonly fb: FormBuilder,
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
      CarActions.createCar({
        car: {
          brandId: (payload.carType! as CarType).brandId,
          fuelType: payload.fuelType!,
          licensePlate: payload.licensePlate,
          modelId: (payload.carType! as CarType).modelId,
          images: payload.images,
        },
      }),
    );
  }
}
