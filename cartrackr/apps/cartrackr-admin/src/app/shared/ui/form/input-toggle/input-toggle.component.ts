import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputBaseComponent } from '../input-base/input-base.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input-toggle.component.html',
  styleUrls: ['./input-toggle.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: InputToggleComponent,
      multi: true,
    },
  ],
})
export class InputToggleComponent extends InputBaseComponent<boolean> {
  override onChangeValue(event: any): void {
    this.onChange(event.target.checked);
    this.onTouched();
  }
}
