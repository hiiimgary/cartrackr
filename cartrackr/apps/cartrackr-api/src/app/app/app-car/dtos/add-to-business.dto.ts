import { IsString } from 'class-validator';

export class AddCarToBusinessDto {
  @IsString()
  token: string;
}
