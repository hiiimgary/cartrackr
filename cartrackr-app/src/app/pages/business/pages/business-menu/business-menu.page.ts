import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthActions } from 'src/app/auth/store/auth.actions';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { selectUser } from 'src/app/auth/store/auth.selectors';
import { IONIC_COMPONENTS } from 'src/app/shared/utils/ionic-components';

@Component({
  selector: 'app-business-menu',
  templateUrl: './business-menu.page.html',
  styleUrls: ['./business-menu.page.scss'],
  standalone: true,
  imports: [...IONIC_COMPONENTS, CommonModule, RouterModule],
})
export class BusinessMenuPage {
  user = this.store.selectSignal(selectUser);

  constructor(private readonly store: Store) {}

  onLogoutClick() {
    this.store.dispatch(AuthActions.logout());
  }
}
