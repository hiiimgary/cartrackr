import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { register } from 'swiper/element/bundle';
import { CarActions } from './pages/tabs/pages/car/store/car.actions';
import { StatusBar, Style } from '@capacitor/status-bar';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  store = inject(Store);

  constructor(private readonly router: Router) {
    register();
    StatusBar.setStyle({ style: Style.Light });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        console.log(event);
      }
    });
  }
}
