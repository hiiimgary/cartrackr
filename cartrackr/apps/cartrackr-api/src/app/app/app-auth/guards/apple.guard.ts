import { Injectable } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-apple-verify-token';

const APPLE_STRATEGY_NAME = 'apple-verify-token';

type AppleToken = {
  iss: string;
  aud: string;
  exp: number;
  iat: number;
  sub: string;
  nonce: string;
  c_hash: string;
  email: string;
  email_verified: string;
  auth_time: number;
};

@Injectable()
export class AppleGuard extends AuthGuard(APPLE_STRATEGY_NAME) {}

@Injectable()
export class AppleStrategy extends PassportStrategy(
  Strategy,
  APPLE_STRATEGY_NAME
) {
  constructor() {
    super({
      clientId: 'com.hiimgary.cartrackr',
    });
  }

  validate(token: AppleToken): { email: string } {
    console.log(token);

    return {
      email: token.email,
    };
  }
}
