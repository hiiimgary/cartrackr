import { CarResponse } from './car';

export interface IsLoggedInResponse {
  user: LoggedInBusinessUser | LoggedInUser;
  cars: CarResponse[];
}

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
