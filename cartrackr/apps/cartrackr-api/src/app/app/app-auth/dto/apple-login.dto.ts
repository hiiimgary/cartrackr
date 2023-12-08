import { AppleLoginRequest } from '@cartrackr/cartrackr-shared';

export class AppleLoginDto implements AppleLoginRequest {
  readonly email: string | null;

  readonly firstName: string | null;

  readonly lastName: string | null;

  readonly access_token: string;
}
