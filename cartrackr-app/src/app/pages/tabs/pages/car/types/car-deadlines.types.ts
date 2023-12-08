import { List, PaginationMeta } from 'src/app/shared/types/list.types';

export type Deadlines = PaginationMeta & {
  readonly list: List<Deadline>;
};

export type Deadline = {
  readonly id: number;
  readonly title: string;
  readonly deadline: Date;
  readonly isDone: boolean;
};

export type CreateDeadline = {
  readonly title: string;
  readonly deadline: Date;
};

export type ModifyDeadline = CreateDeadline & {
  readonly id: number;
};
