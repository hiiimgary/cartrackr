import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromMaps from './maps.reducer';

const selectCarState = createFeatureSelector<fromMaps.State>(
  fromMaps.mapsFeatureKey
);

export const selectLocations = createSelector(
  selectCarState,
  (state) => state.locations
);
