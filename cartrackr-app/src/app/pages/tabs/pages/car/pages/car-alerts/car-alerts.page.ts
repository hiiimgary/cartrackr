import { Component, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ListCardComponent } from '../../ui/list-card/list-card.component';
import { Store } from '@ngrx/store';
import { selectCarAlerts } from '../../store/car.selectors';
import { Alert } from '../../types/car-alert.types';
import { CarActions } from '../../store/car.actions';
import { IONIC_COMPONENTS } from 'src/app/shared/utils/ionic-components';

@Component({
  selector: 'app-car-alerts',
  templateUrl: './car-alerts.page.html',
  styleUrls: ['./car-alerts.page.scss'],
  standalone: true,
  imports: [
    ...IONIC_COMPONENTS,
    CommonModule,
    FormsModule,
    TranslateModule,
    RouterModule,
    ListCardComponent,
  ],
})
export class CarAlertsPage {
  carId: number = +this.route.snapshot.params['id'];

  #alertsSignal = this.store.selectSignal(selectCarAlerts(this.carId));
  unreadAlertsSignal = computed(() =>
    this.#alertsSignal().list.filter((a) => !a.isRead),
  );
  readAlertsSignal = computed(() =>
    this.#alertsSignal().list.filter((a) => a.isRead),
  );

  constructor(
    readonly route: ActivatedRoute,
    private readonly store: Store,
  ) {}

  onResolve(alertId: number) {
    this.store.dispatch(
      CarActions.resolveAlert({ alertId, carId: this.carId }),
    );
  }

  onDelete(alertId: number) {
    this.store.dispatch(CarActions.deleteAlert({ alertId, carId: this.carId }));
  }

  identify(_: number, item: Alert): number {
    return item.id;
  }
}
