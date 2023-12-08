import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { NgxMaskPipe } from 'ngx-mask';
import { ConfirmationModalComponent } from 'src/app/shared/ui/confirmation-modal/confirmation-modal.component';
import { selectCarExpenseDetail } from '../../../../store/car.selectors';
import { IONIC_COMPONENTS } from 'src/app/shared/utils/ionic-components';

@Component({
  selector: 'app-car-service-entry-detail',
  templateUrl: './car-service-entry-detail.page.html',
  styleUrls: ['./car-service-entry-detail.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ...IONIC_COMPONENTS,
    NgxMaskPipe,
    TranslateModule,
    ConfirmationModalComponent,
  ],
})
export class CarServiceEntryDetailPage {
  readonly carId = +this.route.snapshot.params['id'];
  readonly entryId = +this.route.snapshot.params['entryId'];

  isDeleteOpen = false;

  readonly repairDetail = this.store.selectSignal(
    selectCarExpenseDetail(this.carId, this.entryId),
  );

  constructor(
    private readonly store: Store,
    private readonly route: ActivatedRoute,
  ) {}
}
