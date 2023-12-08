import { IsNumber } from 'class-validator';

export class SelectBusinesDto {
  @IsNumber()
  id: number;
}
