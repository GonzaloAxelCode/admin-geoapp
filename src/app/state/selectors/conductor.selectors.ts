
import { ConductoresState } from '@/app/models/conductor.model';
import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';



export const selectConductorState = (state: AppState) => state.Conductores;

export const selectConductor = createSelector(
    selectConductorState,
    (state: ConductoresState) => state
);


