import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { IONIC_COMPONENTS } from '../../utils/ionic-components';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule, ...IONIC_COMPONENTS],
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss'],
})
export class ConfirmationModalComponent {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() isOpen = false;
  @Input() breakpoints: number[] = [0, 0.5];
  @Input() initialBreakpoint: number = 0.5;

  @Output() onToggle = new EventEmitter<boolean>();
}
