import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const SnackbarActions = createActionGroup({
  source: 'Snackbar',
  events: {
    showErrorMsg: props<{ message: string }>(),
  },
});
