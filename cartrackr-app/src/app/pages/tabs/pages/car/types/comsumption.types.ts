import { DateChartData } from 'src/app/shared/types/chart.types';

export type Consumption = {
  readonly average: number;
  readonly refills: DateChartData;
};
