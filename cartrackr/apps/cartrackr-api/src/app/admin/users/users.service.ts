import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import { AppLoginCredential } from './entities/app-login-credential.entity';
import { UserBusiness } from '../user-business/entities/user-business.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(AppLoginCredential)
    private appLoginRepository: Repository<AppLoginCredential>
  ) {}

  findOneByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOneBy({ email });
  }

  async create(user: CreateUserDto) {
    const registeredUser = await this.userRepository.findOneBy({
      email: user.destination,
    });

    if (registeredUser) {
      throw new BadRequestException('E-mail already exists!');
    }

    const newUser = this.userRepository.create({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.destination,
    });

    return this.userRepository.save(newUser);
  }

  async generateAppLoginCredentials(userBusinessId: number): Promise<string> {
    const token = randomBytes(28).toString('hex');

    const newLoginCredential = this.appLoginRepository.create({
      token,
      userBusinessId,
    });

    await this.appLoginRepository.save(newLoginCredential);

    return token;
  }

  async getAppLoginCredentials(token: string): Promise<UserBusiness> {
    const appLogin = await this.appLoginRepository.findOne({
      where: { token },
      relations: ['userBusiness', 'userBusiness.user', 'userBusiness.business'],
    });

    if (!appLogin) {
      throw new BadRequestException('invalid_token');
    }

    return appLogin.userBusiness;
  }

  async deleteAppLoginCredentials(userBusinessId: number) {
    await this.appLoginRepository.delete({ userBusinessId });
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number, relations: string[] = []) {
    return this.userRepository.findOne({ where: { id }, relations });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
