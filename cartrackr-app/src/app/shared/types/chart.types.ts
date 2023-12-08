import { List } from './list.types';

export type DateChartData = List<DateChartItem>;

export type DateChartItem = {
  readonly date: Date;
  readonly value: number;
};
