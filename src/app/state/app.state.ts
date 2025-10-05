
import { ActionReducerMap } from '@ngrx/store';


import { AuthState } from '../models/auth.models';
import { ConductoresState } from '../models/conductor.model';
import { TripsState } from '../models/trips.model';
import { authReducer } from './reducers/auth.reducer';
import { conductoresReducer } from './reducers/conductor.reducer';
import { tripsReducer } from './reducers/trips.reducer';

export interface AppState {
    Auth: AuthState;
    Conductores: ConductoresState;
    Trips: TripsState;
}

export const ROOT_REDUCER: ActionReducerMap<AppState> = {
    Auth: authReducer,
    Conductores: conductoresReducer,
    Trips: tripsReducer,
};