import { PartialType } from '@nestjs/mapped-types';
import { CreateUserBusinessDto } from './create-business-user.dto';

export class UpdateUserBusinessDto extends PartialType(CreateUserBusinessDto) {}
