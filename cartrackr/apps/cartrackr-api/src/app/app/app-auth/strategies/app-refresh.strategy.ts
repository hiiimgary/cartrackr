import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppAuthService } from '../app-auth.service';
import { AppUser } from '../../app-user/entities/app-user.entity';

@Injectable()
export class AppRefreshStrategy extends PassportStrategy(
  Strategy,
  'app-refresh'
) {
  constructor(private readonly authService: AppAuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: 'process.env.JWT_SECRET',
    });
  }

  async validate(payload: {
    sub: number;
    email: string;
    exp: number;
  }): Promise<AppUser> {
    const user = await this.authService.findById(payload.sub);
    console.log(user);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
