import { createFeature, createReducer, on } from '@ngrx/store';
import { List } from 'src/app/shared/types/list.types';
import { MapsActions } from './maps.actions';

export const mapsFeatureKey = 'maps';

export interface State {
  readonly locations: List<any>;
}

export const initialState: State = {
  locations: [],
};

export const reducer = createReducer(
  initialState,
  on(MapsActions.fetchLocationsSuccess, (state, action) => ({
    ...state,
    locations: action.locations,
  }))
);

export const mapsFeature = createFeature({
  name: mapsFeatureKey,
  reducer,
});
