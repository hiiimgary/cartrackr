import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { AppleLoginRequest } from '../../../../../cartrackr/libs/cartrackr-shared/src/lib/model/apple-login-request';
import { Car } from 'src/app/pages/tabs/pages/car/types/car.types';
import { List } from 'src/app/shared/types/list.types';
import { User } from '../types/user.types';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    isLoggedIn: emptyProps(),
    loggedIn: props<{
      user: User;
      cars: List<Car>;
    }>(),
    notLoggedIn: emptyProps(),
    signInWithApple: props<{ payload: AppleLoginRequest }>(),
    signInWithAppleError: emptyProps(),
    signInWithGoogle: emptyProps(),
    signInWithBusiness: props<{ payload: { token: string } }>(),
    signInWithBusinessError: emptyProps(),
    logout: emptyProps(),
  },
});
