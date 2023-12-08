import { List, PaginationMeta } from 'src/app/shared/types/list.types';

export type Alerts = PaginationMeta & {
  readonly unreadCount: number;
  readonly list: List<Alert>;
};

export type Alert = {
  readonly id: number;
  readonly description: string;
  readonly date: Date;
  readonly isRead: boolean;
  readonly isDeleted: boolean;
};

export type AlertCategory = {
  readonly id: number;
  readonly title: string;
};
