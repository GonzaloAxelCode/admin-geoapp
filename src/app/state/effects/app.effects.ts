import { checkTokenAction } from '@/app/state/actions/auth.actions';
import { AppState } from '@/app/state/app.state';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs/operators';
import { loadConductores } from '../actions/conductor.actions';

@Injectable()
export class AppEffects {
    constructor(private actions$: Actions, private store: Store<AppState>) { }

    init$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType('@ngrx/effects/init'),
                tap(() => {
                    this.store.dispatch(checkTokenAction());
                    this.store.dispatch(loadConductores({ query: {} }));


                })
            ),
        { dispatch: false }
    );
}
