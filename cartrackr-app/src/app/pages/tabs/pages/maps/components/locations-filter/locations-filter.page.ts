import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IONIC_COMPONENTS } from 'src/app/shared/utils/ionic-components';

@Component({
  selector: 'app-locations-filter',
  templateUrl: './locations-filter.page.html',
  styleUrls: ['./locations-filter.page.scss'],
  standalone: true,
  imports: [...IONIC_COMPONENTS, CommonModule, FormsModule],
})
export class LocationsFilterPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
