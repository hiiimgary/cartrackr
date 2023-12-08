import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromAuth from './auth.reducer';

export const selectAuthState = createFeatureSelector<fromAuth.State>(
  fromAuth.authFeatureKey,
);

export const selectIsAppInited = createSelector(
  selectAuthState,
  (state) => state.isAppInited,
);

export const selectUserRole = createSelector(
  selectAuthState,
  (state) => state.user?.role,
);

export const selectUser = createSelector(selectAuthState, (state) => ({
  name: `${state.user?.firstName} ${state.user?.lastName}`,
  businessName: state.user?.role === 'business' ? state.user.businessName : '',
  email: state.user?.email,
}));

export const selectIsLoggedIn = createSelector(
  selectAuthState,
  (state) => state.user !== null,
);
