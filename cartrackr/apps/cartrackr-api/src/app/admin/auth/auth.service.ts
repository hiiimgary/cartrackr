import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly adminUserService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(email: string): Promise<User> {
    const user = await this.adminUserService.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedException('user-');
    }

    return user;
  }

  async findById(id: number): Promise<User> {
    const user = await this.adminUserService.findOne(id);

    if (!user) {
      throw new UnauthorizedException('user-not-found');
    }

    return user;
  }

  createNewUser(user: CreateUserDto): Promise<User> {
    return this.adminUserService.create(user);
  }

  async generateAppLoginCredentials(userBusinessId: number): Promise<string> {
    return this.adminUserService.generateAppLoginCredentials(userBusinessId);
  }

  deleteAppLoginCredentials(userBusinessId: number): Promise<void> {
    return this.adminUserService.deleteAppLoginCredentials(userBusinessId);
  }

  async generateJwt(
    user: User,
    activeUserBusinessId: number = null
  ): Promise<string> {
    const payload = { email: user.email, sub: user.id, activeUserBusinessId };
    return this.jwtService.sign(payload);
  }
}
