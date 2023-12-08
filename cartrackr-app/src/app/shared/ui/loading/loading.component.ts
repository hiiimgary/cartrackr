import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Observable } from 'rxjs';
import { IONIC_COMPONENTS } from '../../utils/ionic-components';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule, ...IONIC_COMPONENTS],
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent {
  @Input({ required: true }) isLoading$!: Observable<boolean>;
  @Input() color?: string;
}
