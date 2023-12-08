import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Car } from '../../car/entities/car.entity';
import { Repository } from 'typeorm';
import { Deadline } from '../../car/entities/deadlines.entity';
import { CreateDeadline } from './dtos/create-deadline.dto';

@Injectable()
export class AppCarDeadlineService {
  constructor(
    @InjectRepository(Deadline)
    private readonly deadlineRepository: Repository<Deadline>
  ) {}

  async createDeadline(car: Car, deadlineToCreate: CreateDeadline) {
    const deadline = this.deadlineRepository.create({
      deadline: deadlineToCreate.deadline,
      title: deadlineToCreate.title,
      car,
    });

    return this.deadlineRepository.save(deadline);
  }

  async markDone(carId: number, deadlineId: number) {
    const deadline = await this.deadlineRepository.findOne({
      where: {
        id: deadlineId,
        car: { id: carId },
      },
      relations: ['car'],
    });

    if (!deadline) {
      throw new NotFoundException('deadline_not_found');
    }

    deadline.isDone = true;

    return this.deadlineRepository.save(deadline);
  }

  deleteDeadline(id: number) {
    return this.deadlineRepository.delete({ id });
  }
}
