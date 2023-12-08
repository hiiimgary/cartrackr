import { CreateCar } from '@cartrackr/cartrackr-shared';
import { IsNumber, IsString } from 'class-validator';

export class CreateCarDto implements CreateCar {
  @IsString()
  licensePlate: string;

  @IsNumber()
  modelId: number;

  @IsNumber()
  brandId: number;

  @IsNumber()
  fuelType: number;
}
