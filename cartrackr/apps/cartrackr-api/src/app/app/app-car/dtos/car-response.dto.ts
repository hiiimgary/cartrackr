import {
  CarModel,
  CarResponse,
  Expense,
  Alert,
  ImageResponse,
  Deadline,
} from '@cartrackr/cartrackr-shared';

export class CarResponseDto implements CarResponse {
  deadlines: Deadline[];
  id: number;
  licensePlate: string;
  model: CarModel;
  brand: {
    id: number;
    name: string;
  };
  fuelType: number;
  qrCode: string;
  images: ImageResponse[];
  expenses: Expense[];
  alerts: Alert[];
  businesses: {
    businessCarId: number;
    businessId: number;
    isAccessGranted: boolean;
    createdAt: Date;
    businessName: string;
  }[];
}
