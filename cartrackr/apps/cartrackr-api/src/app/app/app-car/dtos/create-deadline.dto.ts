import { IsDateString, IsString } from 'class-validator';

export class CreateDeadline {
  @IsString()
  title: string;

  @IsDateString()
  deadline: Date;
}
