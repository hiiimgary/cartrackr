import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { selectCarExpenseDetail } from '../../../../store/car.selectors';
import { ActivatedRoute } from '@angular/router';
import { NgxMaskPipe } from 'ngx-mask';
import { TranslateModule } from '@ngx-translate/core';
import { ConfirmationModalComponent } from 'src/app/shared/ui/confirmation-modal/confirmation-modal.component';
import { CarActions } from '../../../../store/car.actions';
import { IONIC_COMPONENTS } from 'src/app/shared/utils/ionic-components';

@Component({
  selector: 'app-expense-detail',
  standalone: true,
  imports: [
    CommonModule,
    ...IONIC_COMPONENTS,
    NgxMaskPipe,
    TranslateModule,
    ConfirmationModalComponent,
  ],
  templateUrl: './expense-detail.component.html',
  styleUrls: ['./expense-detail.component.scss'],
})
export class ExpenseDetailComponent {
  readonly carId = +this.route.snapshot.params['id'];
  readonly expenseId = +this.route.snapshot.params['expenseId'];

  isDeleteOpen = false;

  readonly expenseDetail = this.store.selectSignal(
    selectCarExpenseDetail(this.carId, this.expenseId),
  );

  constructor(
    private readonly store: Store,
    private readonly route: ActivatedRoute,
    private readonly navCtrl: NavController,
  ) {}

  onDeleteConfirmClick(): void {
    this.isDeleteOpen = false;
    this.navCtrl.back();
    this.store.dispatch(
      CarActions.deleteExpense({
        expenseId: this.expenseId,
        carId: this.carId,
      }),
    );
  }
}
