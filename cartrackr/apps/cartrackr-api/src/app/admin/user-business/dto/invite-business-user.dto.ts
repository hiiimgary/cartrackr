import { BusinessRole } from '@cartrackr/cartrackr-shared';
import { IsEmail } from 'class-validator';

export class InviteUserBusinessDto {
  permission: BusinessRole;

  @IsEmail()
  email: string;
}
