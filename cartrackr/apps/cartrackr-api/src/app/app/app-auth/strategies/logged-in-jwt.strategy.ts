import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppAuthService } from '../app-auth.service';

@Injectable()
export class LoggedInJwtStrategy extends PassportStrategy(
  Strategy,
  'logged-in-jwt'
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
    role: string;
    userBusinessId: number;
    exp: number;
  }): Promise<{ role: string; id: number; userBusinessId: number }> {
    if (payload.exp < Date.now() / 1000) {
      throw new UnauthorizedException('expired_token');
    }

    return {
      role: payload.role,
      id: payload.sub,
      userBusinessId: payload.userBusinessId,
    };
  }
}
