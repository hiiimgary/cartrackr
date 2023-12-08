import { ChangeDetectionStrategy, Component } from '@angular/core';
import { InputBaseComponent } from '../input-base/input-base.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { IonInput, IonItem, IonLabel } from '@ionic/angular/standalone';

@Component({
  standalone: true,
  imports: [IonItem, IonInput, IonLabel],
  selector: 'app-input-license-plate',
  templateUrl: './input-license-plate.component.html',
  styleUrls: ['./input-license-plate.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: InputLicensePlateComponent,
      multi: true,
    },
  ],
})
export class InputLicensePlateComponent extends InputBaseComponent<string> {
  onChangeValue(event: any): void {
    this.value = event.detail.value;

    this.onChange(this.value);
    this.onTouched();
  }
}
