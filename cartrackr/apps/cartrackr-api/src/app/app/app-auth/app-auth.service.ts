import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppUser } from '../app-user/entities/app-user.entity';
import { AppUserService } from '../app-user/app-user.service';
import { UserBusiness } from '../../admin/user-business/entities/user-business.entity';

@Injectable()
export class AppAuthService {
  constructor(
    private readonly userService: AppUserService,
    private readonly jwtService: JwtService
  ) {}

  findOrCreateUser(user: {
    email: string;
    firstName: string;
    lastName: string;
  }): Promise<AppUser> {
    return this.userService.findOrCreateUser(user);
  }

  findById(userId: number): Promise<AppUser | null> {
    return this.userService.findById(userId);
  }

  async generateJwtForUser(user: AppUser): Promise<string> {
    const payload = {
      email: user.email,
      sub: user.id,
      businessId: null,
      role: 'user',
    };
    return this.jwtService.sign(payload);
  }

  async generateJwtForBusiness(userBusiness: UserBusiness): Promise<string> {
    const payload = {
      email: userBusiness.user.email,
      sub: userBusiness.user.id,
      userBusinessId: userBusiness.id,
      role: 'business',
    };
    return this.jwtService.sign(payload);
  }

  deleteRefreshTokenForUser(
    user: AppUser,
    refreshToken: string
  ): Promise<void> {
    return this.userService.deleteRefreshTokenForUser(user, refreshToken);
  }

  generateRefreshTokenForUser(user: AppUser): Promise<string> {
    return this.userService.generateRefreshToken(user);
  }

  setFirebaseToken(userId: number, token: string) {
    return this.userService.setFirebaseToken(userId, token);
  }

  deleteFirebaseToken(userId: number, token: string) {
    return this.userService.deleteFirebaseToken(userId, token);
  }
}
