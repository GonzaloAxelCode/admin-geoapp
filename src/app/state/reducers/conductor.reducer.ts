import { ConductoresState } from '@/app/models/conductor.model';
import { createReducer, on } from '@ngrx/store';
import {
  createConductor,
  createConductorFail,
  createConductorSuccess,
  loadConductores,
  loadConductoresFail,
  loadConductoresSuccess,
} from '../actions/conductor.actions';



export const initialState: ConductoresState = {
  conductores: [],
  loadingCreateConductor: false,
  loadingLoadConductores: false,
  error: null,
};

export const conductoresReducer = createReducer(
  initialState,

  // Crear conductor
  on(createConductor, (state) => ({
    ...state,
    loadingCreateConductor: true,
    error: null,
  })),

  on(createConductorSuccess, (state, { conductor }) => ({
    ...state,
    loadingCreateConductor: false,
    conductores: [...state.conductores, conductor],
  })),

  on(createConductorFail, (state, { error }) => ({
    ...state,
    loadingCreateConductor: false,
    error,
  })),

  // Cargar conductores
  on(loadConductores, (state) => ({
    ...state,
    loadingLoadConductores: true,
    error: null,
  })),

  on(loadConductoresSuccess, (state, { conductores }) => ({
    ...state,
    loadingLoadConductores: false,
    conductores,
  })),

  on(loadConductoresFail, (state, { error }) => ({
    ...state,
    loadingLoadConductores: false,
    error,
  }))
);
