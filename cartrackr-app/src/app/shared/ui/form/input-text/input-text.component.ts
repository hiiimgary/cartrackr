import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputBaseComponent } from '../input-base/input-base.component';
import { IonInput, IonItem, IonLabel } from '@ionic/angular/standalone';

@Component({
  selector: 'app-input-text',
  standalone: true,
  imports: [IonItem, IonInput, IonLabel],
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: InputTextComponent,
      multi: true,
    },
  ],
})
export class InputTextComponent extends InputBaseComponent<string> {
  onChangeValue(event: any): void {
    const value = event.target.value;

    this.onChange(value);
    this.onTouched();
  }
}
