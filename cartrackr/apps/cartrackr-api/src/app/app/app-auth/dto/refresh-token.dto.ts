import { RefreshTokenRequest } from '@cartrackr/cartrackr-shared';

export class RefreshTokenRequestDto implements RefreshTokenRequest {
  readonly refreshToken: string;
}
