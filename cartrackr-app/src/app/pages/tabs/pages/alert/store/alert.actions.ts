import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const AlertActions = createActionGroup({
  source: 'Alert',
  events: {
    AlertDriver: props<{
      licensePlate: string;
      reason: number;
    }>(),
    AlertDriverSuccess: emptyProps(),
    AlertDriverError: emptyProps(),
  },
});
