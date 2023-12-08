import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NavController } from '@ionic/angular';
import { InputTextComponent } from 'src/app/shared/ui/form/input-text/input-text.component';
import { Store } from '@ngrx/store';
import { AuthActions } from 'src/app/auth/store/auth.actions';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { IONIC_COMPONENTS } from 'src/app/shared/utils/ionic-components';

@Component({
  selector: 'app-business-login',
  templateUrl: './business-login.page.html',
  styleUrls: ['./business-login.page.scss'],
  standalone: true,
  imports: [
    ...IONIC_COMPONENTS,
    CommonModule,
    ReactiveFormsModule,
    InputTextComponent,
  ],
})
export class BusinessLoginPage implements OnDestroy, OnInit {
  loginForm = this.fb.nonNullable.group({
    token: ['', [Validators.required]],
  });

  isScanning = true;

  constructor(
    private readonly fb: FormBuilder,
    private readonly store: Store,
    private readonly navCtrl: NavController,
  ) {}

  ngOnInit(): void {
    this.startScanning();
  }

  async startScanning() {
    document.body.classList.add('qr-scanning');
    const result = await BarcodeScanner.startScan();
    document.body.classList.remove('qr-scanning');
    if (result.hasContent) {
      this.store.dispatch(
        AuthActions.signInWithBusiness({ payload: { token: result.content } }),
      );
    }
  }

  ngOnDestroy(): void {
    document.body.classList.remove('qr-scanning');
    this.isScanning = false;
  }

  stopScanning() {
    BarcodeScanner.stopScan();
    this.isScanning = false;
    document.body.classList.remove('qr-scanning');
    this.navCtrl.back();
  }

  onSubmit() {
    if (!this.loginForm.valid) {
      return;
    }

    const payload = this.loginForm.getRawValue();

    console.log(payload);

    this.store.dispatch(AuthActions.signInWithBusiness({ payload }));
  }
}
