import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { List } from 'src/app/shared/types/list.types';

export const MapsActions = createActionGroup({
  source: 'Maps',
  events: {
    // Fetch Cars
    fetchLocations: emptyProps(),
    fetchLocationsSuccess: props<{ locations: List<any> }>(),
  },
});
