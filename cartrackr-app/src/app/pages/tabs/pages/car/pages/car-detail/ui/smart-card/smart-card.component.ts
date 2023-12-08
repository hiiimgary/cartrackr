import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { IONIC_COMPONENTS } from 'src/app/shared/utils/ionic-components';

@Component({
  standalone: true,
  imports: [...IONIC_COMPONENTS, CommonModule],
  selector: 'app-smart-card',
  templateUrl: './smart-card.component.html',
  styleUrls: ['./smart-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SmartCardComponent {
  @Input() icon?: string;
  @Input() color: string = 'primary-card';
  @Input() button: boolean = false;
}
