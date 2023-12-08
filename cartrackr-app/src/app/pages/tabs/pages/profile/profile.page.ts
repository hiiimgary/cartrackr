import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { AuthActions } from 'src/app/auth/store/auth.actions';
import { selectUser } from 'src/app/auth/store/auth.selectors';
import { IONIC_COMPONENTS } from 'src/app/shared/utils/ionic-components';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [...IONIC_COMPONENTS, CommonModule],
})
export class ProfilePage {
  user$ = this.store.select(selectUser);
  constructor(private readonly store: Store) {}

  onLogoutClick() {
    this.store.dispatch(AuthActions.logout());
  }
}
