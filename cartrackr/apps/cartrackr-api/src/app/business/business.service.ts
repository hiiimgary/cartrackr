import { Injectable } from '@nestjs/common';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { UserBusiness } from '../admin/user-business/entities/user-business.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Business } from './entities/business.entity';
import { BusinessRole } from '@cartrackr/cartrackr-shared';

@Injectable()
export class BusinessService {
  constructor(
    @InjectRepository(UserBusiness)
    private userBusinessRepository: Repository<UserBusiness>,
    @InjectRepository(Business) private businessRepository: Repository<Business>
  ) {}

  async create(createBusinessDto: CreateBusinessDto, userId: number) {
    const business = this.businessRepository.create(createBusinessDto);

    const savedBusiness = await this.businessRepository.save(business);

    const userBusiness = this.userBusinessRepository.create({
      permission: BusinessRole.OWNER,
      userId,
      business: savedBusiness,
    });

    return this.userBusinessRepository.save(userBusiness);
  }

  findAll() {
    return this.businessRepository.find();
  }

  findOne(id: number) {
    return this.businessRepository.findOne({
      where: { id },
      relations: ['location', 'contactInfo'],
    });
  }

  async update(id: number, updateBusinessDto: UpdateBusinessDto) {
    const business = await this.businessRepository.findOne({
      where: { id },
      relations: ['location', 'contactInfo'],
    });
    return this.businessRepository.save({ ...business, ...updateBusinessDto });
  }

  activate(id: number) {
    return this.businessRepository.update({ id }, { isActive: true });
  }

  remove(id: number) {
    return this.businessRepository.delete({ id });
  }
}
