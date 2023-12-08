import { Injectable } from '@nestjs/common';
import { CreateRefillStationDto } from './dto/create-refill-station.dto';
import { UpdateRefillStationDto } from './dto/update-refill-station.dto';
import { RefillStation } from './entities/refill-station.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RefillStationService {
  constructor(
    @InjectRepository(RefillStation)
    private refillStationRepository: Repository<RefillStation>
  ) {}

  create(createRefillStationDto: CreateRefillStationDto) {
    const refillStation = this.refillStationRepository.create(
      createRefillStationDto
    );

    return this.refillStationRepository.save(refillStation);
  }

  findAll() {
    return this.refillStationRepository.find();
  }

  findOne(id: number) {
    return this.refillStationRepository.findOne({
      where: { id },
      relations: ['location'],
    });
  }

  async update(id: number, updateRefillStationDto: UpdateRefillStationDto) {
    const refillStation = await this.refillStationRepository.findOne({
      where: { id },
      relations: ['location'],
    });
    return this.refillStationRepository.save({
      ...refillStation,
      ...updateRefillStationDto,
    });
  }

  remove(id: number) {
    return this.refillStationRepository.delete(id);
  }
}
