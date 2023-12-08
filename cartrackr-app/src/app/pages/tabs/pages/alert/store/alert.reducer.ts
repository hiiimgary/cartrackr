import { createFeature, createReducer, on } from '@ngrx/store';
import { AlertActions } from './alert.actions';

export const alertFeatureKey = 'alert';

export interface State {
  isLoading: boolean;
}

export const initialState: State = {
  isLoading: false,
};

export const reducer = createReducer(
  initialState,
  on(AlertActions.alertDriver, (state, action) => ({
    ...state,
    isLoading: true,
  })),
  on(AlertActions.alertDriverSuccess, (state, action) => ({
    ...state,
    isLoading: false,
  })),
  on(AlertActions.alertDriverError, (state, action) => ({
    ...state,
    isLoading: false,
  }))
);

export const alertFeature = createFeature({
  name: alertFeatureKey,
  reducer,
});
