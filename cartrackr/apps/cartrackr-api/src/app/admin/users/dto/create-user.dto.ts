import { IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  destination: string;

  firstName: string;
  lastName: string;
}
