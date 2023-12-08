import {
  ActionReducerMap,
  createActionGroup,
  emptyProps,
  provideState,
} from '@ngrx/store';
import { carFeature } from '../pages/tabs/pages/car/store/car.reducer';
import { provideEffects } from '@ngrx/effects';
import { CarEffects } from '../pages/tabs/pages/car/store/car.effects';
import { SnackbarEffects } from './snackbar/snackbar.effects';
import { AlertEffects } from '../pages/tabs/pages/alert/store/alert.effects';
import { authFeature } from '../auth/store/auth.reducer';
import { AuthEffects } from '../auth/store/auth.effects';
import { mapsFeature } from '../pages/tabs/pages/maps/store/maps.reducer';
import { MapsEffects } from '../pages/tabs/pages/maps/store/maps.effects';

export interface State {}

export const reducers: ActionReducerMap<State> = {};

export const AppActions = createActionGroup({
  source: 'App',
  events: {
    init: emptyProps(),
  },
});

export const provideRootStoreFeatures = () => {
  return [
    provideState(carFeature),
    provideState(authFeature),
    provideState(mapsFeature),
    provideEffects([
      CarEffects,
      SnackbarEffects,
      AlertEffects,
      AuthEffects,
      MapsEffects,
    ]),
  ];
};
