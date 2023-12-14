import { createFeature, createReducer, on } from '@ngrx/store';
import { CarActions } from './car.actions';
import { List } from 'src/app/shared/types/list.types';
import { Car } from '../types/car.types';
import compareAsc from 'date-fns/compareAsc';
import { CarBrand } from '@cartrackr/dtos';
import { AuthActions } from 'src/app/auth/store/auth.actions';
import { ExpenseCategory } from '../types/car-expenses.types';
import { AlertCategory } from '../types/car-alert.types';
import compareDesc from 'date-fns/compareDesc';

export const carFeatureKey = 'car';

type FormState = {
  readonly isLoading: boolean;
  readonly errorMsg: string | null;
};

export interface State {
  readonly cars: List<Car>;
  readonly carTypes: List<CarBrand>;
  readonly expenseCategories: List<ExpenseCategory>;
  readonly alertCategories: List<AlertCategory>;
  readonly addCarState: FormState;
  readonly addExpenseState: FormState;
  readonly addDeadlineState: FormState;
  readonly deleteCarState: FormState;
}

export const initialState: State = {
  addCarState: {
    isLoading: false,
    errorMsg: null,
  },
  deleteCarState: {
    isLoading: false,
    errorMsg: null,
  },
  addExpenseState: {
    isLoading: false,
    errorMsg: null,
  },
  addDeadlineState: {
    isLoading: false,
    errorMsg: null,
  },
  cars: [],
  expenseCategories: [],
  carTypes: [],
  alertCategories: [],
};

export const reducer = createReducer(
  initialState,
  on(CarActions.initSuccess, (state, action) => ({
    ...state,
    carTypes: action.init.carTypes,
    expenseCategories: action.init.expenseCategories,
    alertCategories: action.init.alertTypes,
  })),
  on(CarActions.fetchCars, (state) => ({
    ...state,
    cars: [],
  })),
  on(CarActions.fetchCarDetailSuccess, (state, action) => ({
    ...state,
    cars: state.cars.map((car) =>
      car.id === action.car.id ? action.car : car
    ),
  })),
  on(CarActions.fetchCarsSuccess, (state, { cars }) => ({
    ...state,
    cars,
  })),
  on(AuthActions.loggedIn, CarActions.refreshSuccess, (state, { cars }) => ({
    ...state,
    cars,
  })),
  on(CarActions.createCar, (state) => ({
    ...state,
    addCarState: {
      ...state.addCarState,
      isLoading: true,
      errorMsg: null,
    },
  })),
  on(CarActions.createCarSuccess, (state, { car }) => ({
    ...state,
    addCarState: {
      ...state.addCarState,
      isLoading: false,
      errorMsg: null,
    },
    cars: [car, ...state.cars],
  })),
  on(CarActions.createCarError, (state, { errorMsg }) => ({
    ...state,
    addCarState: {
      ...state.addCarState,
      isLoading: false,
      errorMsg,
    },
  })),
  on(CarActions.modifyCar, (state) => ({
    ...state,
    addCarState: {
      ...state.addCarState,
      isLoading: true,
      errorMsg: null,
    },
  })),
  on(CarActions.modifyCarSuccess, (state, { car }) => ({
    ...state,
    addCarState: {
      ...state.addCarState,
      isLoading: false,
      errorMsg: null,
    },
    cars: state.cars.map((c) => (c.id === car.id ? car : c)),
  })),
  on(CarActions.modifyCarError, (state, { errorMsg }) => ({
    ...state,
    addCarState: {
      ...state.addCarState,
      isLoading: false,
      errorMsg,
    },
  })),
  on(CarActions.deleteCar, (state) => ({
    ...state,
    deleteCarState: {
      ...state.deleteCarState,
      isLoading: true,
      errorMsg: null,
    },
  })),
  on(CarActions.deleteCarSuccess, (state, { carId }) => ({
    ...state,
    deleteCarState: {
      ...state.deleteCarState,
      isLoading: false,
      errorMsg: null,
    },
    cars: state.cars.filter((c) => c.id !== carId),
  })),
  on(CarActions.fetchAlerts, (state, { carId }) => ({
    ...state,
    cars: state.cars.map((car) =>
      car.id === carId
        ? {
            ...car,
            alerts: {
              ...car.alerts,
              isLoading: true,
              errorMsg: null,
            },
          }
        : car
    ),
  })),
  on(
    CarActions.fetchAlertsSuccess,
    (state, { alerts, carId, currentPage }) => ({
      ...state,
      cars: state.cars.map((car) =>
        car.id === carId
          ? {
              ...car,
              alerts: {
                ...car.alerts,
                isLoading: false,
                list: [...car.alerts.list, ...alerts],
                currentPage,
                hasMore: alerts.length > 0,
              },
            }
          : car
      ),
    })
  ),
  on(CarActions.resolveAlert, (state, { alertId, carId }) => ({
    ...state,
    cars: state.cars.map((car) =>
      car.id === carId
        ? {
            ...car,
            alerts: {
              ...car.alerts,
              list: car.alerts.list.map((a) =>
                a.id === alertId ? { ...a, isRead: true } : a
              ),
              unreadCount: car.alerts.unreadCount - 1,
            },
          }
        : car
    ),
  })),
  on(CarActions.resolveAlertError, (state, { alertId, carId }) => ({
    ...state,
    cars: state.cars.map((car) =>
      car.id === carId
        ? {
            ...car,
            alerts: {
              ...car.alerts,
              list: car.alerts.list.map((a) =>
                a.id === alertId ? { ...a, isRead: false } : a
              ),
              unreadCount: car.alerts.unreadCount + 1,
            },
          }
        : car
    ),
  })),
  on(CarActions.deleteAlert, (state, { alertId, carId }) => ({
    ...state,
    cars: state.cars.map((car) =>
      car.id === carId
        ? {
            ...car,
            alerts: {
              ...car.alerts,
              list: car.alerts.list.map((a) =>
                a.id === alertId ? { ...a, isDeleted: true } : a
              ),
              unreadCount: car.alerts.unreadCount - 1,
            },
          }
        : car
    ),
  })),
  on(CarActions.deleteAlertSuccess, (state, { alertId, carId }) => ({
    ...state,
    cars: state.cars.map((car) =>
      car.id === carId
        ? {
            ...car,
            alerts: {
              ...car.alerts,
              list: car.alerts.list.filter((a) => a.id !== alertId),
            },
          }
        : car
    ),
  })),
  on(CarActions.deleteAlertError, (state, { alertId, carId }) => ({
    ...state,
    cars: state.cars.map((car) =>
      car.id === carId
        ? {
            ...car,
            alerts: {
              ...car.alerts,
              list: car.alerts.list.map((a) =>
                a.id === alertId ? { ...a, isDeleted: false } : a
              ),
              unreadCount: car.alerts.unreadCount + 1,
            },
          }
        : car
    ),
  })),
  on(CarActions.fetchExpenses, (state, { carId }) => ({
    ...state,
    cars: state.cars.map((car) =>
      car.id === carId
        ? {
            ...car,
            expenses: {
              ...car.expenses,
              isLoading: true,
              errorMsg: null,
            },
          }
        : car
    ),
  })),
  on(
    CarActions.fetchExpensesSuccess,
    (state, { expenses, carId, currentPage }) => ({
      ...state,
      cars: state.cars.map((car) =>
        car.id === carId
          ? {
              ...car,
              expenses: {
                ...car.expenses,
                isLoading: false,
                list: [...car.expenses.list, ...expenses],
                currentPage,
                hasMore: expenses.length > 0,
              },
            }
          : car
      ),
    })
  ),
  on(CarActions.createExpense, (state) => ({
    ...state,
    addExpenseState: {
      ...state.addExpenseState,
      isLoading: true,
      errorMsg: null,
    },
  })),
  on(CarActions.createExpenseSuccess, (state, { expense, carId }) => ({
    ...state,
    addExpenseState: {
      ...state.addExpenseState,
      isLoading: false,
      errorMsg: null,
    },
    cars: state.cars.map((car) =>
      car.id === carId
        ? {
            ...car,
            expenses: {
              ...car.expenses,
              list: [expense, ...car.expenses.list].sort((a, b) =>
                compareDesc(a.date, b.date)
              ),
            },
          }
        : car
    ),
  })),
  on(CarActions.createExpenseError, (state, { errorMsg }) => ({
    ...state,
    addExpenseState: {
      ...state.addExpenseState,
      isLoading: false,
      errorMsg,
    },
  })),
  on(CarActions.modifyExpense, (state) => ({
    ...state,
    addExpenseState: {
      ...state.addExpenseState,
      isLoading: true,
      errorMsg: null,
    },
  })),
  on(CarActions.modifyExpenseSuccess, (state, { expense, carId }) => ({
    ...state,
    addExpenseState: {
      ...state.addExpenseState,
      isLoading: false,
      errorMsg: null,
    },
    cars: state.cars.map((car) =>
      car.id === carId
        ? {
            ...car,
            expenses: {
              ...car.expenses,
              list: car.expenses.list.map((e) =>
                e.id === expense.id ? expense : e
              ),
            },
          }
        : car
    ),
  })),
  on(CarActions.modifyExpenseError, (state, { errorMsg }) => ({
    ...state,
    addExpenseState: {
      ...state.addExpenseState,
      isLoading: false,
      errorMsg,
    },
  })),
  on(CarActions.deleteExpense, (state, { expenseId, carId }) => ({
    ...state,
    cars: state.cars.map((car) =>
      car.id === carId
        ? {
            ...car,
            expenses: {
              ...car.expenses,
              list: car.expenses.list.map((e) =>
                e.id === expenseId ? { ...e, isDeleted: true } : e
              ),
            },
          }
        : car
    ),
  })),
  on(CarActions.deleteExpenseSuccess, (state, { expenseId, carId }) => ({
    ...state,
    cars: state.cars.map((car) =>
      car.id === carId
        ? {
            ...car,
            expenses: {
              ...car.expenses,
              list: car.expenses.list.filter((e) => e.id !== expenseId),
            },
          }
        : car
    ),
  })),
  on(CarActions.deleteExpenseError, (state, { expenseId, carId }) => ({
    ...state,
    cars: state.cars.map((car) =>
      car.id === carId
        ? {
            ...car,
            expenses: {
              ...car.expenses,
              list: car.expenses.list.map((e) =>
                e.id === expenseId ? { ...e, isDeleted: false } : e
              ),
            },
          }
        : car
    ),
  })),
  on(CarActions.fetchDeadlines, (state, { carId }) => ({
    ...state,
    cars: state.cars.map((car) =>
      car.id === carId
        ? {
            ...car,
            deadlines: {
              ...car.deadlines,
              isLoading: true,
              errorMsg: null,
            },
          }
        : car
    ),
  })),
  on(
    CarActions.fetchDeadlinesSuccess,
    (state, { deadlines, carId, currentPage }) => ({
      ...state,
      cars: state.cars.map((car) =>
        car.id === carId
          ? {
              ...car,
              deadlines: {
                ...car.deadlines,
                isLoading: false,
                list: [...car.deadlines.list, ...deadlines],
                currentPage,
                hasMore: deadlines.length > 0,
              },
            }
          : car
      ),
    })
  ),
  on(CarActions.createDeadline, CarActions.modifyDeadline, (state) => ({
    ...state,
    addDeadlineState: {
      ...state.addDeadlineState,
      isLoading: true,
      errorMsg: null,
    },
  })),
  on(CarActions.createDeadlineSuccess, (state, { deadline, carId }) => ({
    ...state,
    addDeadlineState: {
      ...state.addDeadlineState,
      isLoading: false,
      errorMsg: null,
    },
    cars: state.cars.map((car) =>
      car.id === carId
        ? {
            ...car,
            deadlines: {
              ...car.deadlines,
              list: [deadline, ...car.deadlines.list].sort((a, b) =>
                compareAsc(a.deadline, b.deadline)
              ),
            },
          }
        : car
    ),
  })),
  on(
    CarActions.createDeadlineError,
    CarActions.modifyDeadlineError,
    (state, { errorMsg }) => ({
      ...state,
      addDeadlineState: {
        ...state.addDeadlineState,
        isLoading: false,
        errorMsg,
      },
    })
  ),
  on(CarActions.modifyDeadlineSuccess, (state, { deadline, carId }) => ({
    ...state,
    addDeadlineState: {
      ...state.addDeadlineState,
      isLoading: false,
      errorMsg: null,
    },
    cars: state.cars.map((car) =>
      car.id === carId
        ? {
            ...car,
            deadlines: {
              ...car.deadlines,
              list: car.deadlines.list.map((d) =>
                d.id === deadline.id ? deadline : d
              ),
            },
          }
        : car
    ),
  })),

  on(CarActions.markDeadlineDone, (state, { deadlineId, carId }) => ({
    ...state,
    cars: state.cars.map((car) =>
      car.id === carId
        ? {
            ...car,
            deadlines: {
              ...car.deadlines,
              list: car.deadlines.list.map((d) =>
                d.id === deadlineId ? { ...d, isDone: true } : d
              ),
            },
          }
        : car
    ),
  })),
  on(CarActions.markDeadlineDoneError, (state, { deadlineId, carId }) => ({
    ...state,
    cars: state.cars.map((car) =>
      car.id === carId
        ? {
            ...car,
            deadlines: {
              ...car.deadlines,
              list: car.deadlines.list.map((d) =>
                d.id === deadlineId ? { ...d, isDone: false } : d
              ),
            },
          }
        : car
    ),
  })),
  on(CarActions.deleteDeadline, (state, { deadlineId, carId }) => ({
    ...state,
    cars: state.cars.map((car) =>
      car.id === carId
        ? {
            ...car,
            deadlines: {
              ...car.deadlines,
              list: car.deadlines.list.map((d) =>
                d.id === deadlineId ? { ...d, isDeleted: true } : d
              ),
            },
          }
        : car
    ),
  })),
  on(CarActions.deleteDeadlineSuccess, (state, { deadlineId, carId }) => ({
    ...state,
    cars: state.cars.map((car) =>
      car.id === carId
        ? {
            ...car,
            deadlines: {
              ...car.deadlines,
              list: car.deadlines.list.filter((d) => d.id !== deadlineId),
            },
          }
        : car
    ),
  })),
  on(CarActions.deleteDeadlineError, (state, { deadlineId, carId }) => ({
    ...state,
    cars: state.cars.map((car) =>
      car.id === carId
        ? {
            ...car,
            deadlines: {
              ...car.deadlines,
              list: car.deadlines.list.map((d) =>
                d.id === deadlineId ? { ...d, isDeleted: false } : d
              ),
            },
          }
        : car
    ),
  })),
  on(
    CarActions.changeBusinessAccessSuccess,
    (state, { businessCarId, carId, allowAccess }) => ({
      ...state,
      cars: state.cars.map((car) =>
        car.id === carId
          ? {
              ...car,
              businesses: allowAccess
                ? car.businesses.map((b) =>
                    b.businessCarId === businessCarId
                      ? { ...b, isAccessGranted: true }
                      : b
                  )
                : car.businesses.filter(
                    (b) => b.businessCarId !== businessCarId
                  ),
            }
          : car
      ),
    })
  )
);

export const carFeature = createFeature({
  name: carFeatureKey,
  reducer,
});
