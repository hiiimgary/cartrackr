import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Input,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableHeaderTemplateDirective } from '../../directives/table-header-template.directive';
import { TableRowTemplateDirective } from '../../directives/table-row-template.directive';

@Component({
  selector: 'cartrackr-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgTableComponent<TItem extends object> {
  @Input() data!: TItem[];
  @ContentChild(TableHeaderTemplateDirective, { read: TemplateRef })
  headers?: TemplateRef<any>;
  @ContentChild(TableRowTemplateDirective, { read: TemplateRef })
  rows?: TemplateRef<any>;
}

export const tableComponentImports = [
  NgTableComponent,
  TableHeaderTemplateDirective,
  TableRowTemplateDirective,
];
