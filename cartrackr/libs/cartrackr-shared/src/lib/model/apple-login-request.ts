export interface AppleLoginRequest {
  readonly access_token: string;
  readonly firstName: string | null;
  readonly lastName: string | null;
  readonly email: string | null;
}
