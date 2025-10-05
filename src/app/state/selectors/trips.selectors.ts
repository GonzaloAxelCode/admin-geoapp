
import { TripsState } from '@/app/models/trips.model';
import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';



export const selectTripsState = (state: AppState) => state.Trips

export const selectTrips = createSelector(
    selectTripsState,
    (state: TripsState) => state
);


