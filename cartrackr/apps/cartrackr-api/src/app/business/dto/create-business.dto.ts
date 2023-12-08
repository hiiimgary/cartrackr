import { IsEmail, IsPhoneNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { LocationDto } from '../../location/dto/create-location.dto';

export class ContactInfoDto {
  @IsEmail()
  email: string;

  @IsPhoneNumber()
  phone: string;
}

export class CreateBusinessDto {
  name: string;

  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @ValidateNested()
  @Type(() => ContactInfoDto)
  contactInfo: ContactInfoDto;
}
