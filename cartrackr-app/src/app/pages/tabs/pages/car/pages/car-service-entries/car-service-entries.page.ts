import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ListCardComponent } from '../../ui/list-card/list-card.component';
import { selectCarServiceEntries } from '../../store/car.selectors';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { IONIC_COMPONENTS } from 'src/app/shared/utils/ionic-components';

@Component({
  selector: 'app-car-service-entries',
  templateUrl: './car-service-entries.page.html',
  styleUrls: ['./car-service-entries.page.scss'],
  standalone: true,
  imports: [
    ...IONIC_COMPONENTS,
    CommonModule,
    FormsModule,
    ListCardComponent,
    RouterModule,
  ],
})
export class CarServiceEntriesPage {
  carId: number = +this.route.snapshot.params['id'];

  serviceEntrySignal = this.store.selectSignal(
    selectCarServiceEntries(this.carId),
  );

  constructor(
    readonly route: ActivatedRoute,
    private readonly store: Store,
  ) {}
}
