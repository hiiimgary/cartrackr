import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  IonIcon,
  IonItem,
  IonItemOptions,
  IonItemSliding,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-list-card',
  standalone: true,
  imports: [IonItem, IonItemSliding, IonItemOptions, IonIcon, CommonModule],
  templateUrl: './list-card.component.html',
  styleUrls: ['./list-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListCardComponent {
  @Input() icon?: string;
  @Input() color: string = 'primary-card';
  @Input() button: boolean = false;
}
