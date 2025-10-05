import { TripsState } from '@/app/models/trips.model';
import { createReducer, on } from '@ngrx/store';
import {
  loadTripsByDate,
  loadTripsByDateFail,
  loadTripsByDateSuccess,
  loadTripsByUser,
  loadTripsByUserFail,
  loadTripsByUserSuccess
} from '../effects/trips.actions';

export const initialState: TripsState = {
  trips: [],
  loadingLoadTrips: false,
  loadingTripsByDate: false,  // 👈 nuevo flag
  error: null,
};

export const tripsReducer = createReducer(
  initialState,

  // 🔹 load trips by user
  on(loadTripsByUser, (state) => ({
    ...state,
    loadingLoadTrips: true,
    error: null,
  })),
  on(loadTripsByUserSuccess, (state, { trips }) => ({
    ...state,
    trips: trips,
    loadingLoadTrips: false,
    error: null,
  })),
  on(loadTripsByUserFail, (state, { error }) => ({
    ...state,
    loadingLoadTrips: false,
    error: error,
  })),

  // 🔹 load trips by date
  on(loadTripsByDate, (state) => ({
    ...state,
    loadingTripsByDate: true,
    error: null,
  })),
  on(loadTripsByDateSuccess, (state, { trips }) => ({
    ...state,
    trips: trips,
    loadingTripsByDate: false,
    error: null,
  })),
  on(loadTripsByDateFail, (state, { error }) => ({
    ...state,
    loadingTripsByDate: false,
    error: error,
  })),
);
