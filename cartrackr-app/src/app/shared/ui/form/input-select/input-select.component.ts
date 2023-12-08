import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { InputBaseComponent } from '../input-base/input-base.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';
import { SelectOption } from 'src/app/shared/types/select.types';
import { List } from 'src/app/shared/types/list.types';
import { NgFor } from '@angular/common';

@Component({
  standalone: true,
  imports: [NgFor, IonItem, IonSelect, IonSelectOption, IonLabel],
  selector: 'app-input-select',
  templateUrl: './input-select.component.html',
  styleUrls: ['./input-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: InputSelectComponent,
      multi: true,
    },
  ],
})
export class InputSelectComponent extends InputBaseComponent<number> {
  @Input({ required: true }) options!: List<SelectOption>;

  onChangeValue(event: any): void {
    const value = event.detail.value;

    this.onChange(value);
    this.onTouched();
  }
}
