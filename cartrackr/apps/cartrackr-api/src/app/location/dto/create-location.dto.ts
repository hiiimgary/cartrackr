import { IsLatitude, IsNumberString, IsLongitude } from 'class-validator';

export class LocationDto {
  @IsLatitude()
  @IsNumberString()
  latitude: string;

  @IsLongitude()
  @IsNumberString()
  longitude: string;

  country: string;

  zipCode: string;
  city: string;
  street: string;
  streetNumber: string;
}
