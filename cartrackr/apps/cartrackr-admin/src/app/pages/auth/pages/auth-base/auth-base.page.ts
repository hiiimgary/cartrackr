import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './auth-base.page.html',
  styleUrls: ['./auth-base.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthBasePage {}
