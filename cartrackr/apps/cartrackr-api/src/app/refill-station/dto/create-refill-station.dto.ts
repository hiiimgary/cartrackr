import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { LocationDto } from '../../location/dto/create-location.dto';

export class CreateRefillStationDto {
  name: string;
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;
}
