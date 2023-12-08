import { Component, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { selectCarDeadlines } from '../../store/car.selectors';
import compareDesc from 'date-fns/compareDesc';
import compareAsc from 'date-fns/compareAsc';
import { Store } from '@ngrx/store';
import { ListCardComponent } from '../../ui/list-card/list-card.component';
import {
  ADD_DEADLINE_MODAL_ID,
  CreateDeadlinePage,
} from './pages/create-deadline/create-deadline.page';
import { CarActions } from '../../store/car.actions';
import { IONIC_COMPONENTS } from 'src/app/shared/utils/ionic-components';

@Component({
  selector: 'app-car-deadlines',
  templateUrl: './car-deadlines.page.html',
  styleUrls: ['./car-deadlines.page.scss'],
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
export class CarDeadlinesPage {
  carId: number = +this.route.snapshot.params['id'];

  pastDueSignal = computed(() =>
    this.#deadlinesSignal().list.filter(
      (d) => !d.isDone && compareDesc(d.deadline, new Date()) === 1,
    ),
  );

  resolvedSignal = computed(() =>
    this.#deadlinesSignal().list.filter((d) => d.isDone),
  );
  unresolvedSignal = computed(() =>
    this.#deadlinesSignal().list.filter(
      (d) => !d.isDone && compareAsc(d.deadline, new Date()) === 1,
    ),
  );

  #deadlinesSignal = this.store.selectSignal(selectCarDeadlines(this.carId));

  constructor(
    readonly route: ActivatedRoute,
    private readonly store: Store,
    private readonly modalCtrl: ModalController,
  ) {}

  onOpenCreateClick(): void {
    this.modalCtrl
      .create({
        component: CreateDeadlinePage,
        cssClass: 'create-modal',
        id: ADD_DEADLINE_MODAL_ID,
        componentProps: {
          carId: this.carId,
        },
      })
      .then((modal) => {
        modal.present();
      });
  }

  onMarkDeadlineDone(id: number) {
    this.store.dispatch(
      CarActions.markDeadlineDone({ deadlineId: id, carId: this.carId }),
    );
  }

  onDeleteDeadline(id: number) {
    this.store.dispatch(
      CarActions.deleteDeadline({ deadlineId: id, carId: this.carId }),
    );
  }
}
