import { IsString } from 'class-validator';

export class NofityOwnerDto {
  @IsString()
  title: string;
}
