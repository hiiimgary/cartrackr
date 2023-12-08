import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserBusiness } from './entities/user-business.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserBusinessDto } from './dto/update-business-user.dto';
import { User } from '../users/entities/user.entity';
import { BusinessRole } from '@cartrackr/cartrackr-shared';

@Injectable()
export class UserBusinessService {
  constructor(
    @InjectRepository(UserBusiness)
    private userBusinessRepository: Repository<UserBusiness>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  findAllByUserId(userId: number): Promise<UserBusiness[]> {
    return this.userBusinessRepository.find({
      where: { userId },
      relations: ['business'],
    });
  }

  async findByUserBusinessId(userBusinessId: number): Promise<UserBusiness> {
    const userBusiness = await this.userBusinessRepository.findOne({
      where: { id: userBusinessId },
      relations: ['business', 'user'],
    });

    if (!userBusiness) {
      throw new NotFoundException('business-not-found');
    }

    return userBusiness;
  }

  async findUserBusinessById(
    userBusinessId: number,
    userId: number,
    relations = ['business']
  ): Promise<UserBusiness> {
    console.log(userBusinessId, userId);

    const activeBusiness = await this.userBusinessRepository.findOne({
      where: { id: userBusinessId },
    });

    if (!activeBusiness) {
      throw new NotFoundException('business-not-found');
    }

    const userBusiness = await this.userBusinessRepository.findOne({
      where: {
        userId,
      },
      relations,
    });

    console.log(activeBusiness);
    console.log(userBusiness);

    if (!userBusiness) {
      throw new NotFoundException('business-not-found');
    }

    if (activeBusiness.businessId !== userBusiness.businessId) {
      throw new BadRequestException('cannot-access-business');
    }

    return userBusiness;
  }

  async findById(
    activeUserBusinessId: number,
    userBusinessId: number,
    relations = ['business']
  ): Promise<UserBusiness> {
    console.log(activeUserBusinessId, userBusinessId);

    const activeBusiness = await this.userBusinessRepository.findOne({
      where: { id: activeUserBusinessId },
    });

    if (!activeBusiness) {
      throw new NotFoundException('business-not-found');
    }

    const userBusiness = await this.userBusinessRepository.findOne({
      where: {
        id: userBusinessId,
      },
      relations,
    });

    console.log(activeBusiness);
    console.log(userBusiness);

    if (!userBusiness) {
      throw new NotFoundException('business-not-found');
    }

    if (activeBusiness.businessId !== userBusiness.businessId) {
      throw new BadRequestException('cannot-access-business');
    }

    return userBusiness;
  }

  async findEmployees(userBusiness: number) {
    const activeBusiness = await this.userBusinessRepository.findOne({
      where: { id: userBusiness },
    });

    if (!activeBusiness) {
      throw new NotFoundException('business-not-found');
    }

    return this.userBusinessRepository.find({
      where: { businessId: activeBusiness.businessId },
      relations: ['user'],
    });
  }

  async invite(
    userBusinessId: number,
    email: string,
    permission: BusinessRole
  ) {
    const activeBusiness = await this.userBusinessRepository.findOne({
      where: { id: userBusinessId },
      relations: ['business'],
    });

    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('user-not-found');
    }

    const userBusiness = this.userBusinessRepository.create({
      businessId: activeBusiness.businessId,
      user,
      permission,
    });

    return this.userBusinessRepository.save(userBusiness);
  }

  async update(
    activeUserBusinessId: number,
    userBusinessId: number,
    updateUserDto: UpdateUserBusinessDto
  ) {
    const activeBusiness = await this.userBusinessRepository.findOne({
      where: { id: activeUserBusinessId },
    });

    const userBusinessToUpdate = await this.userBusinessRepository.findOne({
      where: { id: userBusinessId },
    });

    if (!activeBusiness || !userBusinessToUpdate) {
      throw new NotFoundException('business-not-found');
    }

    if (activeBusiness.businessId !== userBusinessToUpdate.businessId) {
      throw new BadRequestException('business-not-found');
    }

    userBusinessToUpdate.permission = updateUserDto.permission;

    return this.userBusinessRepository.save(userBusinessToUpdate);
  }

  remove(id: number) {
    return this.userBusinessRepository.delete(id);
  }
}
