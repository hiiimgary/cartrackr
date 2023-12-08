import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppAuthService } from '../app-auth.service';
import { AppUser } from '../../app-user/entities/app-user.entity';

@Injectable()
export class AppJwtStrategy extends PassportStrategy(Strategy, 'app-jwt') {
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
    role: string;
    exp: number;
  }): Promise<AppUser> {
    if (payload.exp < Date.now() / 1000) {
      throw new UnauthorizedException('expired_token');
    }

    if (payload.role !== 'user') {
      throw new UnauthorizedException('cannot_access');
    }

    const user = await this.authService.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
