export type User = {
  readonly id: number;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly isActivated: boolean;
  readonly isBlocked: boolean;
  readonly isAdmin: boolean;
  readonly registrationDate: string;
};
