import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../icon/icon.component';
import { InputBaseComponent } from '../input-base/input-base.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectOption } from './select.types';

@Component({
  selector: 'app-input-select',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './input-select.component.html',
  styleUrls: ['./input-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: InputSelectComponent,
      multi: true,
    },
  ],
})
export class InputSelectComponent extends InputBaseComponent<string> {
  @Input() options: SelectOption[] = [];

  override onChangeValue(value: string): void {
    this.onChange(value);
    this.onTouched();
  }
}
