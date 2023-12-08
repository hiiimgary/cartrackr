import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { LoadingComponent } from '../loading/loading.component';
import { IONIC_COMPONENTS } from '../../utils/ionic-components';

@Component({
  selector: 'app-card-button',
  standalone: true,
  imports: [CommonModule, ...IONIC_COMPONENTS, LoadingComponent],
  templateUrl: './card-button.component.html',
  styleUrls: ['./card-button.component.scss'],
})
export class CardButtonComponent {
  @Input({ required: true }) iconName!: string;
  @Input() color = '';
  @Input() isLoading$: Observable<boolean> = of(false);

  @Output() cardClick = new EventEmitter<void>();
}
