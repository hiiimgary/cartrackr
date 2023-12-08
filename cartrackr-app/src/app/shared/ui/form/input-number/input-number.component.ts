import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputBaseComponent } from '../input-base/input-base.component';
import { IonInput, IonItem, IonLabel } from '@ionic/angular/standalone';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-input-number',
  standalone: true,
  imports: [CommonModule, IonItem, IonLabel, NgxMaskDirective],
  templateUrl: './input-number.component.html',
  styleUrls: ['./input-number.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: InputNumberComponent,
      multi: true,
    },
  ],
})
export class InputNumberComponent extends InputBaseComponent<number> {
  onChangeValue(event: any): void {
    const value = parseInt(event.target.value.replaceAll(' ', ''));
    console.log(value);

    this.onChange(value);
    this.onTouched();
  }
}
