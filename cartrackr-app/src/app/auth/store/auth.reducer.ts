import { createFeature, createReducer, on } from '@ngrx/store';
import { AuthActions } from './auth.actions';
import { User } from '../types/user.types';

export const authFeatureKey = 'auth';

export interface State {
  readonly isAppInited: boolean;
  readonly user: User | null;
}

export const initialState: State = {
  isAppInited: false,
  user: null,
};

export const reducer = createReducer(
  initialState,
  on(AuthActions.loggedIn, (state, action) => ({
    ...state,
    user: action.user,
    isAppInited: true,
  })),
  on(AuthActions.notLoggedIn, AuthActions.logout, (state) => ({
    ...state,
    user: null,
    isAppInited: true,
  }))
);

export const authFeature = createFeature({
  name: authFeatureKey,
  reducer,
});
