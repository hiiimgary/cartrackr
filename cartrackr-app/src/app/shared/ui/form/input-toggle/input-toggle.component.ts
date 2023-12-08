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
  IonToggle,
} from '@ionic/angular/standalone';
import { SelectOption } from 'src/app/shared/types/select.types';
import { List } from 'src/app/shared/types/list.types';
import { NgFor } from '@angular/common';

@Component({
  standalone: true,
  imports: [NgFor, IonItem, IonToggle, IonLabel],
  selector: 'app-input-toggle',
  templateUrl: './input-toggle.component.html',
  styleUrls: ['./input-toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: InputToggleComponent,
      multi: true,
    },
  ],
})
export class InputToggleComponent extends InputBaseComponent<boolean> {
  onChangeValue(checked: boolean): void {
    console.log(checked);

    this.onChange(checked);
    this.onTouched();
  }
}
