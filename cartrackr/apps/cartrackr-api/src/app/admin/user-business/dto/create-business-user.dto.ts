import { BusinessRole } from '@cartrackr/cartrackr-shared';
import { CreateUserDto } from '../../users/dto/create-user.dto';

export class CreateUserBusinessDto {
  permission: BusinessRole;
  user: CreateUserDto;
}
