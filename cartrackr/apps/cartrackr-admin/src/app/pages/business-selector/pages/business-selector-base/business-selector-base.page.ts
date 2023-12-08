import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './business-selector-base.page.html',
  styleUrls: ['./business-selector-base.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BusinessSelectorBasePage {}
