import { PartialType } from '@nestjs/mapped-types';
import { CreateRefillStationDto } from './create-refill-station.dto';

export class UpdateRefillStationDto extends PartialType(
  CreateRefillStationDto
) {}
