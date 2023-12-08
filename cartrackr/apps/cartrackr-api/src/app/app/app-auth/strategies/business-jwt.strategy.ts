import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../../../admin/users/entities/user.entity';
import { UsersService } from '../../../admin/users/users.service';
import { UserBusinessService } from '../../../admin/user-business/user-business.service';
import { UserBusiness } from '../../../admin/user-business/entities/user-business.entity';

@Injectable()
export class BusinessJwtStrategy extends PassportStrategy(
  Strategy,
  'business-jwt'
) {
  constructor(private readonly userBusinessService: UserBusinessService) {
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
  }): Promise<UserBusiness> {
    if (payload.exp < Date.now() / 1000) {
      throw new UnauthorizedException('expired_token');
    }

    if (payload.role !== 'business') {
      throw new UnauthorizedException('cannot_access');
    }

    const user = await this.userBusinessService.findByUserBusinessId(
      payload.userBusinessId
    );

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
