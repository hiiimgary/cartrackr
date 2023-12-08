import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  effect,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { QRCodeModule } from 'angularx-qrcode';
import { environment } from '../../../../../environments/environment';
import {
  BehaviorSubject,
  interval,
  map,
  startWith,
  switchMap,
  tap,
  timer,
} from 'rxjs';

const COUNT_DOWN = 30;

@Component({
  standalone: true,
  imports: [CommonModule, QRCodeModule],
  templateUrl: './app-login.component.html',
  styleUrls: ['./app-login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppLoginComponent implements OnInit {
  loginToken = signal<string>('');

  counterSubject = new BehaviorSubject(COUNT_DOWN);
  counter$ = this.counterSubject.asObservable().pipe(
    switchMap((from: number) => {
      return interval(1000).pipe(
        map((i) => {
          const newTime = from - i;
          if (newTime <= 0) {
            return 0;
          }
          return newTime;
        }),
        tap(() => {
          this.cd.detectChanges();
        })
      );
    })
  );

  constructor(private readonly cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    const eventSource = new EventSource(
      `${environment.apiUrl}/admin-auth/app-login`,
      { withCredentials: true }
    );
    eventSource.onmessage = ({ data }) => {
      const { token } = JSON.parse(data);
      this.loginToken.set(token);
      console.log(token);

      this.counterSubject.next(COUNT_DOWN);
      this.cd.detectChanges();
    };
  }
}
