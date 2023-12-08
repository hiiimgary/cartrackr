export type User = LoggedInBusinessUser | LoggedInUser;

export interface LoggedInBusinessUser {
  email: string;
  firstName: string;
  lastName: string;
  role: 'business';
  businessName: string;
}

export interface LoggedInUser {
  email: string;
  firstName: string;
  lastName: string;
  role: 'user';
}
