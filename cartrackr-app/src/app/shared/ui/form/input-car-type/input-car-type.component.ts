import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  Signal,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { InputBaseComponent } from '../input-base/input-base.component';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonDatetime,
  IonDatetimeButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonPopover,
  IonSearchbar,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { CarType } from './car-type.types';
import { AsyncPipe, JsonPipe, NgFor, NgIf } from '@angular/common';
import { CarBrand, CarModel, CarModelCategory } from '@cartrackr/dtos';
import { List } from 'src/app/shared/types/list.types';
import { Observable, map, startWith, tap } from 'rxjs';

@Component({
  selector: 'app-input-car-type',
  standalone: true,
  imports: [
    IonItem,
    IonLabel,
    IonDatetimeButton,
    IonPopover,
    IonDatetime,
    IonModal,
    IonButton,
    IonHeader,
    IonContent,
    IonList,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonIcon,
    NgFor,
    IonSearchbar,
    AsyncPipe,
    ReactiveFormsModule,
    NgIf,
  ],

  templateUrl: './input-car-type.component.html',
  styleUrls: ['./input-car-type.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: InputCarTypeComponent,
      multi: true,
    },
  ],
})
export class InputCarTypeComponent extends InputBaseComponent<CarType> {
  @Input({ required: true }) brands!: List<CarBrand>;

  isPopoverOpen = false;

  searchControl = inject(FormBuilder).control('');

  selectedBrand: Signal<CarBrand | null> = signal(null);
  selectedModelCategory: Signal<CarModelCategory | null> = signal(null);

  displayValue: Signal<string | null> = signal(null);

  filteredBrands$: Observable<List<CarBrand>> =
    this.searchControl.valueChanges.pipe(
      startWith(''),
      map((search) => {
        if (!search) {
          return this.brands;
        }

        return this.brands.filter((brand) =>
          brand.name.toLowerCase().includes(search.toLowerCase())
        );
      })
    );

  override writeValue(value: CarType): void {
    this.value = value;
    this.setDisplayValue(value, true);
  }

  goBack() {
    if (this.selectedModelCategory()) {
      this.selectedModelCategory = signal(null);
    } else if (this.selectedBrand()) {
      this.selectedBrand = signal(null);
    }
  }

  onChangeValue(value: CarType): void {
    this.value = value;
    this.setDisplayValue(value);
    this.onChange(value);
    this.onTouched();
  }

  private setDisplayValue(value: CarType, init = false): void {
    if (!value) {
      this.displayValue = signal(null);
      return;
    }

    const brand = this.brands.find((brand) => brand.id === value.brandId);

    if (!brand) {
      this.displayValue = signal(null);
      return;
    }

    if (init) {
      this.selectedBrand = signal(brand);
    }

    const modelWithCategory = brand.categories.reduce<CarModel | null>(
      (model, category) => {
        if (model) {
          return model;
        }

        if (category.models.length === 0) {
          return null;
        }

        const m = category.models.find((m) => m.id === value.modelId);

        if (m) {
          if (init) {
            this.selectedModelCategory = signal(category);
          }
          return m;
        }

        return null;
      },
      null
    );

    const model =
      modelWithCategory || brand.models.find((m) => m.id === value.modelId);

    if (!model) {
      this.displayValue = signal(null);
      return;
    }

    this.displayValue = signal(`${brand.name} ${model.name}`);
  }

  onSelectBrand(brand: CarBrand): void {
    this.selectedBrand = signal(brand);
    this.searchControl.setValue('');
  }

  onSelectModelCategory(model: CarModelCategory, modal: IonModal): void {
    this.selectedModelCategory = signal(model);
  }

  onSetCarType(modelId: number, modal: IonModal): void {
    this.onChangeValue({
      brandId: this.selectedBrand()!.id,
      modelId,
    });
    modal.isOpen = false;
  }
}
