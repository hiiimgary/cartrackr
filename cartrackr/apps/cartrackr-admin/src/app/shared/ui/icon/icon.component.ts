import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Observable, filter, take } from 'rxjs';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  template: '',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent implements OnInit {
  @Input({ required: true }) name!: string;

  static loadedIcons: { [key: string]: Observable<string | null> } = {};

  constructor(private readonly vcr: ViewContainerRef) {}

  ngOnInit(): void {
    if (IconComponent.loadedIcons[this.name]) {
      IconComponent.loadedIcons[this.name]
        .pipe(
          filter((icon) => icon !== null),
          take(1)
        )
        .subscribe((text) => {
          this.vcr.element.nativeElement.innerHTML = text;
        });
      return;
    }

    const subject$ = new BehaviorSubject<string | null>(null);

    IconComponent.loadedIcons[this.name] = subject$.asObservable();
    fetch(`assets/icons/icon-${this.name}.svg`)
      .then((res) => {
        if (res.status !== 200) {
          throw new Error('Icon not found');
        }
        return res.text();
      })
      .then((text) => {
        subject$.next(text);
        this.vcr.element.nativeElement.innerHTML = text;
      })
      .catch(() => '');
  }
}
