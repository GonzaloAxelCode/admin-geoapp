import { Conductor } from '@/app/models/conductor.model';
import { createAction, props } from '@ngrx/store';

// Enum con tipos de acción
export enum ActionTypes {
    CREATE_CONDUCTOR = '[Conductor] Create Conductor',
    CREATE_CONDUCTOR_SUCCESS = '[Conductor] Create Conductor Success',
    CREATE_CONDUCTOR_FAIL = '[Conductor] Create Conductor Fail',

    LOAD_CONDUCTORES = '[Conductor] Load Conductores',
    LOAD_CONDUCTORES_SUCCESS = '[Conductor] Load Conductores Success',
    LOAD_CONDUCTORES_FAIL = '[Conductor] Load Conductores Fail',
}

// Crear conductor
export const createConductor = createAction(
    ActionTypes.CREATE_CONDUCTOR,
    props<{ conductor: Conductor }>()
);

export const createConductorSuccess = createAction(
    ActionTypes.CREATE_CONDUCTOR_SUCCESS,
    props<{ conductor: Conductor }>()
);

export const createConductorFail = createAction(
    ActionTypes.CREATE_CONDUCTOR_FAIL,
    props<{ error: any }>()
);

// Cargar conductores
export const loadConductores = createAction(
    ActionTypes.LOAD_CONDUCTORES,
    props<{ query: any }>()
);

export const loadConductoresSuccess = createAction(
    ActionTypes.LOAD_CONDUCTORES_SUCCESS,
    props<{ conductores: Conductor[] }>()
);

export const loadConductoresFail = createAction(
    ActionTypes.LOAD_CONDUCTORES_FAIL,
    props<{ error: any }>()
);


// Cargar conductores
export const loadAllConductores = createAction(
    ActionTypes.LOAD_CONDUCTORES,

);

export const loadAllConductoresSuccess = createAction(
    ActionTypes.LOAD_CONDUCTORES_SUCCESS,
    props<{ all_conductores: Conductor[] }>()
);

export const loadAllConductoresFail = createAction(
    ActionTypes.LOAD_CONDUCTORES_FAIL,
    props<{ error: any }>()
);

