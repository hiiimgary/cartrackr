import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextComponent } from 'src/app/shared/ui/form/input-text/input-text.component';
import { Store } from '@ngrx/store';
import {
  IonToolbar,
  IonButton,
  IonContent,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonHeader,
  NavController,
} from '@ionic/angular/standalone';
import { CarActions } from 'src/app/pages/tabs/pages/car/store/car.actions';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

@Component({
  selector: 'app-business-scan-car',
  templateUrl: './business-scan-car.page.html',
  styleUrls: ['./business-scan-car.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextComponent,
    IonContent,
    IonButton,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonHeader,
  ],
})
export class BusinessScanCarPage implements OnInit, OnDestroy {
  isScanning = true;

  constructor(
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
        CarActions.addCarToBusiness({ token: result.content }),
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
}
