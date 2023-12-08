import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { formatISO } from 'date-fns';
import parseISO from 'date-fns/parseISO';
import { DatePipe } from 'src/app/shared/pipes/date.pipe';
import { InputBaseComponent } from '../input-base/input-base.component';
import {
  IonDatetime,
  IonDatetimeButton,
  IonItem,
  IonLabel,
  IonPopover,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-input-date',
  standalone: true,
  imports: [
    DatePipe,
    IonItem,
    IonLabel,
    IonDatetimeButton,
    IonPopover,
    IonDatetime,
  ],
  templateUrl: './input-date.component.html',
  styleUrls: ['./input-date.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: InputDateComponent,
      multi: true,
    },
  ],
})
export class InputDateComponent extends InputBaseComponent<Date> {
  isPopoverOpen = false;

  dateTimeValue!: string;

  override writeValue(value: Date): void {
    this.dateTimeValue = formatISO(value);
  }

  onChangeValue(event: any): void {
    this.onChange(parseISO(event.detail.value));
    this.onTouched();
  }
}
