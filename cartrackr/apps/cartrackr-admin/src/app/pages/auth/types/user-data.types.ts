import { BusinessRole } from '@cartrackr/cartrackr-shared';
import { List } from '../../../shared/types/list.types';

export type UserData = {
  readonly activeBusiness: UserBusiness | null;
  readonly businesses: List<UserBusiness>;
  readonly user: {
    readonly id: number;
    readonly email: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly isAdmin: boolean;
  };
};

export type UserBusiness = {
  readonly id: number;
  readonly businessId: number;
  readonly name: string;
  readonly permission: BusinessRole;
  readonly isActive: boolean;
};
