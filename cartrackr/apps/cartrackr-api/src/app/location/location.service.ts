import { Injectable } from '@nestjs/common';
import { Location } from './entity/location.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly expenseCategoryRepository: Repository<Location>
  ) {}
  async findAll() {
    const locations = await this.expenseCategoryRepository
      .createQueryBuilder('location')
      .leftJoinAndSelect(
        'location.business',
        'business',
        'business.isActive = true'
      )
      .leftJoinAndSelect('location.refillStation', 'refillStation')
      .where('location.latitude != :empty', { empty: '' })
      .andWhere('location.longitude != :empty', { empty: '' })
      .getMany();

    return locations.filter(
      (location) => location.business || location.refillStation
    );
  }
}
