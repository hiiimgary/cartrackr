import { Injectable } from '@nestjs/common';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';
import { AlertType } from './entities/alert-type.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AlertService {
  constructor(
    @InjectRepository(AlertType)
    private readonly alertsRepository: Repository<AlertType>
  ) {}
  create(createAlertDto: CreateAlertDto) {
    const alert = this.alertsRepository.create(createAlertDto);

    return this.alertsRepository.save(alert);
  }

  findAll() {
    return this.alertsRepository.find();
  }

  findOne(id: number) {
    return this.alertsRepository.findOneBy({ id });
  }

  update(id: number, updateAlertDto: UpdateAlertDto) {
    return this.alertsRepository.update({ id }, updateAlertDto);
  }

  remove(id: number) {
    return this.alertsRepository.delete({ id });
  }
}
