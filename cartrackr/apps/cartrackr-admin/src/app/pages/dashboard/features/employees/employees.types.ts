import { BusinessRole } from '@cartrackr/cartrackr-shared';
import { User } from '../user/user.types';

export type Employees = User & {
  readonly userBusinessId: number;
  readonly permission: BusinessRole;
};

export const PERMISSIONS = [
  { label: 'Owner', value: BusinessRole.OWNER },
  { label: 'Manager', value: BusinessRole.MANAGER },
  { label: 'Employee', value: BusinessRole.EMPLOYEE },
];
