import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromAlert from './alert.reducer';

const selectAlertState = createFeatureSelector<fromAlert.State>(
  fromAlert.alertFeatureKey
);

export const selectAlertIsLoading = createSelector(
  selectAlertState,
  (state) => state.isLoading
);
