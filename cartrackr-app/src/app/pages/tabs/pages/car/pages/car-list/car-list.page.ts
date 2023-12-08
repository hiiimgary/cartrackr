import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonHeader,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
  ModalController,
  Platform,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { ADD_CAR_MODAL_ID, CreateCarPage } from '../create-car/create-car.page';
import { Store } from '@ngrx/store';
import { selectCarList } from '../../store/car.selectors';
import { CarListItem } from './types/car-list-item.types';
import { CarListItemComponent } from './ui/car-list-item/car-list-item.component';
import { AuthActions } from 'src/app/auth/store/auth.actions';
import { CarActions } from '../../store/car.actions';

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.page.html',
  styleUrls: ['./car-list.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ScrollingModule,
    CarListItemComponent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonRefresher,
    IonRefresherContent,
    IonButtons,
    IonButton,
    IonIcon,
    IonRow,
    IonCol,
    IonText,
    IonBackButton,
  ],
})
export class CarListPage {
  listSignal = this.store.selectSignal(selectCarList);

  readonly viewport = {
    itemSize: `${((this.plt.width() - 10) / 16) * 9}`,
    minBuffer: `${this.plt.height() * 1.5}`,
    maxBuffer: `${this.plt.height() * 2.5}`,
  };

  constructor(
    private readonly modalCtrl: ModalController,
    private readonly plt: Platform,
    private readonly store: Store,
  ) {}

  onOpenCreateClick(): void {
    this.modalCtrl
      .create({
        component: CreateCarPage,
        cssClass: 'create-modal',
        id: ADD_CAR_MODAL_ID,
      })
      .then((modal) => {
        modal.present();
      });
  }

  onRefresh(ev: any) {
    this.store.dispatch(CarActions.refresh());
    setTimeout(() => {
      ev.target.complete();
    }, 1000);
  }

  identify(_: number, item: CarListItem): number {
    return item.id;
  }
}
