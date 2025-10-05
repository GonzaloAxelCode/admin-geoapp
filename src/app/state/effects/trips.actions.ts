import { createAction, props } from "@ngrx/store";

export enum ActionTypes {
    LOAD_TRIPS_BY_USER = '[Conductor] Load Trips By User',
    LOAD_TRIPS_BY_USER_SUCCESS = '[Conductor] Load Trips By User Success',
    LOAD_TRIPS_BY_USER_FAIL = '[Conductor] Load Trips By User Fail',

    LOAD_TRIPS_BY_DATE = '[Conductor] Load Trips By Date',
    LOAD_TRIPS_BY_DATE_SUCCESS = '[Conductor] Load Trips By Date Success',
    LOAD_TRIPS_BY_DATE_FAIL = '[Conductor] Load Trips By Date Fail',
}

// 📌 Cargar viajes por usuario
export const loadTripsByUser = createAction(
    ActionTypes.LOAD_TRIPS_BY_USER,
    props<{ userId: number }>()
);

export const loadTripsByUserSuccess = createAction(
    ActionTypes.LOAD_TRIPS_BY_USER_SUCCESS,
    props<{ trips: any[] }>()
);

export const loadTripsByUserFail = createAction(
    ActionTypes.LOAD_TRIPS_BY_USER_FAIL,
    props<{ error: any }>()
);

// 📌 Cargar viajes por fecha
export const loadTripsByDate = createAction(
    ActionTypes.LOAD_TRIPS_BY_DATE,
    props<{ date: string, userId: number }>() // ejemplo: '2025-10-03'
);

export const loadTripsByDateSuccess = createAction(
    ActionTypes.LOAD_TRIPS_BY_DATE_SUCCESS,
    props<{ trips: any[] }>()
);

export const loadTripsByDateFail = createAction(
    ActionTypes.LOAD_TRIPS_BY_DATE_FAIL,
    props<{ error: any }>()
);
