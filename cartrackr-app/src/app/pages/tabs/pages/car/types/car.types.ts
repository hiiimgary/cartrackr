import { Alerts } from './car-alert.types';
import { List } from 'src/app/shared/types/list.types';
import { Expenses } from './car-expenses.types';
import { Deadlines } from './car-deadlines.types';
import { Consumption } from './comsumption.types';
import { Mileage } from './mileage.types';
import { CarModel, ImageResponse } from '@cartrackr/dtos';

export type Car = {
  readonly id: number;
  readonly licensePlate: string;
  readonly model: CarModel;
  readonly brand: {
    readonly id: number;
    readonly name: string;
  };
  readonly qrCode: string;
  readonly fuelType: number;
  readonly images: List<ImageResponse>;
  readonly alerts: Alerts;
  readonly expenses: Expenses;
  readonly deadlines: Deadlines;
  readonly consumption: Consumption;
  readonly mileage: Mileage;
  readonly businesses: {
    readonly businessCarId: number;
    readonly businessId: number;
    readonly isAccessGranted: boolean;
    readonly createdAt: Date;
    readonly businessName: string;
  }[];
};
