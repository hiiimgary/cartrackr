import { GoogleLoginRequest } from '@cartrackr/cartrackr-shared';
import { IsString } from 'class-validator';

export class GoogleLoginDto implements GoogleLoginRequest {
  @IsString()
  readonly idToken: string;
}
