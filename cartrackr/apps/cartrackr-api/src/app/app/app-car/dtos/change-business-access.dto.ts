import { IsBoolean, IsNumber } from 'class-validator';

export class ChangeBusinessAccessDto {
  @IsNumber()
  businessCarId: number;

  @IsBoolean()
  allowAccess: boolean;
}
