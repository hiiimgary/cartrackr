import { IsString } from 'class-validator';

export class BusinessLoginDto {
  @IsString()
  token: string;
}
