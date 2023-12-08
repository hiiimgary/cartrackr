import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectCar } from '../../store/car.selectors';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CardButtonComponent } from 'src/app/shared/ui/card-button/card-button.component';
import { FullscreenGalleryModalComponent } from 'src/app/shared/ui/fullscreen-gallery/components/fullscreen-gallery-modal/fullscreen-gallery-modal.component';
import { TranslateModule } from '@ngx-translate/core';
import { CarDetail } from './types/car-detail.types';
import { Platform } from '@ionic/angular';
import { SmartCardComponent } from './ui/smart-card/smart-card.component';
import { LinechartComponent } from 'src/app/shared/ui/linechart/linechart.component';
import { ConfirmationModalComponent } from 'src/app/shared/ui/confirmation-modal/confirmation-modal.component';
import { CarActions } from '../../store/car.actions';
import { NgxMaskPipe } from 'ngx-mask';
import { QRCodeModule } from 'angularx-qrcode';
import { ListCardComponent } from '../../ui/list-card/list-card.component';
import { IONIC_COMPONENTS } from 'src/app/shared/utils/ionic-components';
import { AuthActions } from 'src/app/auth/store/auth.actions';

@Component({
  selector: 'app-car-detail',
  templateUrl: './car-detail.page.html',
  styleUrls: ['./car-detail.page.scss'],
  standalone: true,
  imports: [
    ...IONIC_COMPONENTS,
    CommonModule,
    CardButtonComponent,
    FullscreenGalleryModalComponent,
    TranslateModule,
    SmartCardComponent,
    RouterModule,
    LinechartComponent,
    ConfirmationModalComponent,
    NgxMaskPipe,
    QRCodeModule,
    ListCardComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarDetailPage {
  carSignal = this.store.selectSignal(
    selectCar(+this.route.snapshot.paramMap.get('id')!),
  );

  isFullscreenGalleryOpen = false;

  isDeleteOpen = false;
  isQrOpen = false;

  width = this.plt.width();

  constructor(
    private readonly store: Store,
    private readonly route: ActivatedRoute,
    private readonly plt: Platform,
  ) {}

  onDeleteConfirmClick(): void {
    this.isDeleteOpen = false;
    this.store.dispatch(CarActions.deleteCar({ carId: this.carSignal().id }));
  }

  onChangeBusinessAccess(businessCarId: number, allowAccess: boolean) {
    this.store.dispatch(
      CarActions.changeBusinessAccess({
        businessCarId,
        allowAccess,
        carId: this.carSignal().id,
      }),
    );
  }

  onRefresh(ev: any) {
    this.store.dispatch(CarActions.refresh());
    setTimeout(() => {
      ev.target.complete();
    }, 1000);
  }
}
