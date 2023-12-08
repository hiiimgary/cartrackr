import { Controller, Get } from '@nestjs/common';
import { LocationService } from './location.service';

@Controller('locations')
export class LocationController {
  constructor(private readonly mapsService: LocationService) {}

  @Get()
  findAll() {
    return this.mapsService.findAll();
  }
}
