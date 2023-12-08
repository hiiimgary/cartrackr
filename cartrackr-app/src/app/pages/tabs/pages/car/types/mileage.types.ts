import { DateChartData } from 'src/app/shared/types/chart.types';

export type Mileage = {
  readonly currentMileage: number;
  readonly data: DateChartData;
};
