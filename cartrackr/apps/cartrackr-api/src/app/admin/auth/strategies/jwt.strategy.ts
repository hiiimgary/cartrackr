import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([JwtStrategy.extractJWT]),
      ignoreExpiration: false,
      secretOrKey: 'process.env.JWT_SECRET',
    });
  }

  async validate(payload: {
    sub: number;
    email: string;
    activeUserBusinessId: number;
  }) {
    const user = await this.authService.validateUser(payload.email);

    return {
      ...user,
      activeUserBusinessId: payload.activeUserBusinessId,
    };
  }

  public static extractJWT(req: Request): string | null {
    if (req.cookies?.access_token && req.cookies.access_token.length > 0) {
      return req.cookies.access_token;
    }

    return null;
  }
}
