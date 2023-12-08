import { Observable } from 'rxjs';
import { List } from '../../../shared/types/list.types';

export abstract class EntityService {
  abstract readonly fetchListTable$: () => Observable<Table>;
}

export type Table = {
  readonly header: List<ColumnHeader>;
  readonly rows: List<TableRow>;
};

export type ColumnHeader = {
  readonly title: string;
};

export type TableRow = {
  readonly id: string;
  readonly cells: List<TableCell>;
};

export type TableCell = {
  readonly value: string;
};
