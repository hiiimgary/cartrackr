import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { InputBaseComponent } from '../input-base/input-base.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  IonItem,
  IonLabel,
  IonRadioGroup,
  IonRadio,
  IonListHeader,
  IonList,
} from '@ionic/angular/standalone';
import { SelectOption } from 'src/app/shared/types/select.types';
import { List } from 'src/app/shared/types/list.types';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    IonItem,
    IonRadio,
    IonRadioGroup,
    IonLabel,
    IonList,
    IonListHeader,
  ],
  selector: 'app-input-radio',
  templateUrl: './input-radio.component.html',
  styleUrls: ['./input-radio.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: InputRadioComponent,
      multi: true,
    },
  ],
})
export class InputRadioComponent extends InputBaseComponent<number> {
  @Input({ required: true }) options!: List<SelectOption>;

  onChangeValue(value: any): void {
    if (typeof value === 'string') {
      value = this.options[0].key;
    }

    this.onChange(value);
    this.onTouched();
  }
}
