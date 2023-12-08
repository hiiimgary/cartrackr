import { Component, Input, OnInit } from '@angular/core';
import { IonCard, IonCardContent, IonText } from '@ionic/angular/standalone';
import { CarListItem } from '../../types/car-list-item.types';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-car-list-item',
  standalone: true,
  imports: [RouterModule, IonCard, IonCardContent, IonText],
  templateUrl: './car-list-item.component.html',
  styleUrls: ['./car-list-item.component.scss'],
})
export class CarListItemComponent {
  @Input({ required: true }) car!: CarListItem;
}
