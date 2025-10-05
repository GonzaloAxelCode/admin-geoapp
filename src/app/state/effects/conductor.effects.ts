
import { ConductorService } from '@/app/services/conductor.service';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { createConductor, createConductorFail, createConductorSuccess, loadConductores, loadConductoresFail, loadConductoresSuccess } from '../actions/conductor.actions';

@Injectable()
export class ConductorEffects {

    constructor(private actions$: Actions, private conductorService: ConductorService) { }


    loadConductorEffect = createEffect(() =>
        this.actions$.pipe(
            ofType(loadConductores),
            exhaustMap(({ query }) =>
                this.conductorService.fetchLoadConductores(query).pipe(
                    map((response: any) => {


                        console.log(response)
                        return loadConductoresSuccess({
                            conductores: response?.users

                        });
                    }),
                    catchError((error) =>
                        of(
                            loadConductoresFail({ error })
                        )
                    )
                )
            )
        )
    );

    createConductorEffect = createEffect(() =>
        this.actions$.pipe(
            ofType(createConductor),
            exhaustMap(({ conductor }) =>
                this.conductorService.fetchCreateConductor(conductor).pipe(
                    map((response: any) => {
                        return createConductorSuccess({
                            conductor: response?.user
                        });
                    }),
                    catchError((error) =>
                        of(
                            createConductorFail({ error })
                        )
                    )
                )
            )
        )
    );

}
