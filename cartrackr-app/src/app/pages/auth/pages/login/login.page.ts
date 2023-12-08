import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SignInWithApple } from '@capacitor-community/apple-sign-in';
import { RouterModule } from '@angular/router';
import { AppleLoginRequest } from '@cartrackr/dtos';
import { Store } from '@ngrx/store';
import { AuthActions } from 'src/app/auth/store/auth.actions';
import { IONIC_COMPONENTS } from 'src/app/shared/utils/ionic-components';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [...IONIC_COMPONENTS, CommonModule, FormsModule, RouterModule],
})
export class LoginPage {
  isIos = this.plt.is('ios');
  constructor(
    private readonly store: Store,
    private readonly plt: Platform,
  ) {}

  onSignInWithAppleClick(): void {
    SignInWithApple.authorize({
      clientId: 'com.hiimgary.cartrackr',
      redirectURI: '/asd',
      scopes: 'email name',
      nonce: 'nonce',
    }).then((res) => {
      console.log(res);
      if (res.response && res.response.identityToken) {
        const params: AppleLoginRequest = {
          access_token: res.response.identityToken,
          firstName: res.response.givenName,
          lastName: res.response.familyName,
          email: res.response.email,
        };
        this.store.dispatch(AuthActions.signInWithApple({ payload: params }));
      }
    });
  }

  onSignInWithGoogleClick(): void {
    console.log('onSignInWithGoogleClick');

    this.store.dispatch(AuthActions.signInWithGoogle());
  }
}
