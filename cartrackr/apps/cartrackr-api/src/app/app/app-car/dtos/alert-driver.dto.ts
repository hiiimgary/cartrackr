import { IsNumber, IsString } from 'class-validator';

export class AlertDriverDto {
  @IsString()
  licensePlate: string;
  @IsNumber()
  reason: number;
}
