import { Directive, Input } from '@angular/core';

@Directive()
export abstract class InputBaseComponent<T> {
  @Input({ required: true }) label!: string;
  @Input() placeholder: string = '';

  value!: T;

  disabled = false;

  onChange!: (value: T) => void;
  onTouched!: () => void;

  writeValue(value: T): void {
    this.value = value;
  }
  registerOnChange(onChange: (value: T) => void): void {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  abstract onChangeValue(event: any): void;
}
