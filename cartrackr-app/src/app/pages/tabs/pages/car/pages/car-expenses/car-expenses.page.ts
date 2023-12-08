import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { selectCarExpenses } from '../../store/car.selectors';
import {
  ADD_EXPENSE_MODAL_ID,
  CreateExpensePage,
} from './pages/create-expense/create-expense.page';
import { DatePipe } from 'src/app/shared/pipes/date.pipe';
import { ListCardComponent } from '../../ui/list-card/list-card.component';
import { IONIC_COMPONENTS } from 'src/app/shared/utils/ionic-components';

@Component({
  selector: 'app-car-expenses',
  templateUrl: './car-expenses.page.html',
  styleUrls: ['./car-expenses.page.scss'],
  standalone: true,
  imports: [
    ...IONIC_COMPONENTS,

    CommonModule,
    FormsModule,
    RouterModule,
    TranslateModule,
    DatePipe,
    ListCardComponent,
  ],
})
export class CarExpensesPage {
  carId: number = +this.route.snapshot.params['id'];

  expensesSignal = this.store.selectSignal(selectCarExpenses(this.carId));

  constructor(
    readonly route: ActivatedRoute,
    private readonly store: Store,
    private readonly modalCtrl: ModalController,
  ) {}

  onOpenCreateClick(): void {
    this.modalCtrl
      .create({
        component: CreateExpensePage,
        cssClass: 'create-modal',
        id: ADD_EXPENSE_MODAL_ID,
        componentProps: {
          carId: this.carId,
        },
      })
      .then((modal) => {
        modal.present();
      });
  }
}
