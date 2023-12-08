import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IONIC_COMPONENTS } from 'src/app/shared/utils/ionic-components';

@Component({
  selector: 'app-station-detail',
  templateUrl: './station-detail.page.html',
  styleUrls: ['./station-detail.page.scss'],
  standalone: true,
  imports: [...IONIC_COMPONENTS, CommonModule, FormsModule],
})
export class StationDetailPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
