import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AppUser } from './entities/app-user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AppleLoginDto } from '../app-auth/dto/apple-login.dto';
import { randomBytes } from 'crypto';
import { RefreshToken } from './entities/refresh-token.entity';
import { NotificationToken } from './entities/notification-token.entity';

@Injectable()
export class AppUserService {
  constructor(
    @InjectRepository(AppUser)
    private readonly usersRepository: Repository<AppUser>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    @InjectRepository(NotificationToken)
    private readonly fcmTokenRepository: Repository<NotificationToken>
  ) {}

  async findOrCreateUser(user: {
    email: string;
    firstName: string;
    lastName: string;
  }): Promise<AppUser> {
    const registeredUser = await this.usersRepository.findOneBy({
      email: user.email,
    });

    if (registeredUser) {
      return registeredUser;
    }

    const newUser: AppUser = this.usersRepository.create({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    return this.usersRepository.save(newUser);
  }

  async findById(userId: number): Promise<AppUser | null> {
    const user = await this.usersRepository.findOneBy({ id: userId });

    if (!user) {
      return null;
    }

    return user;
  }

  async deleteRefreshTokenForUser(
    user: AppUser,
    refreshToken: string
  ): Promise<void> {
    const token = await this.refreshTokenRepository.findOne({
      where: { token: refreshToken, user: { id: user.id } },
      relations: ['user'],
    });

    if (!token) {
      throw new UnauthorizedException('invalid_refresh_token');
    }

    await this.refreshTokenRepository.delete(token);
  }

  async generateRefreshToken(user: AppUser): Promise<string> {
    const refreshToken = randomBytes(256).toString('hex');

    const newRefreshToken = this.refreshTokenRepository.create({
      token: refreshToken,
      user,
    });

    await this.refreshTokenRepository.save(newRefreshToken);

    return refreshToken;
  }

  async setFirebaseToken(userId: number, token: string) {
    const user = await this.usersRepository.findOneBy({ id: userId });

    if (!user) {
      throw new UnauthorizedException('user_not_found');
    }

    const fcmToken = this.fcmTokenRepository.create({
      token,
      user,
    });

    await this.fcmTokenRepository.save(fcmToken);
  }

  async deleteFirebaseToken(userId: number, token: string) {
    const fcmToken = await this.fcmTokenRepository.findOne({
      where: { token, user: { id: userId } },
      relations: ['user'],
    });

    if (!fcmToken) {
      throw new UnauthorizedException('token_not_found');
    }

    await this.fcmTokenRepository.delete(fcmToken);
  }
}
