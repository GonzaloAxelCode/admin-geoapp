import { AuthService } from '@/app/services/auth.service';

import { saveAuthDataToLocalStorage } from '@/app/services/utils/localstorage-functions';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';
import {
    checkTokenAction,
    checkTokenActionFail,
    checkTokenActionSuccess,
    loginInAction,
    loginInActionFail,
    loginInActionSuccess
} from '../actions/auth.actions';

@Injectable()
export class AuthEffects {

    constructor(private actions$: Actions, private authService: AuthService) { }


    loginEffect = createEffect(() =>
        this.actions$.pipe(
            ofType(loginInAction),
            exhaustMap(({ username, password }) =>
                this.authService.fetchCreateToken({ username, password }).pipe(
                    map((response: any) => {

                        saveAuthDataToLocalStorage({
                            accessToken: response?.token,
                            refreshToken: response?.refresah_token,
                            admin: response?.admin,
                        });


                        return loginInActionSuccess({
                            admin: response?.admin,
                            refreshToken: response?.refresah_token,
                            accessToken: response?.token,
                            isAuthenticated: true,
                            isLoadingLogin: false,
                            isLoadingLogout: false,

                        });
                    }),
                    catchError((error) =>
                        of(
                            loginInActionFail({
                                admin: {
                                    id_admin: 0,
                                    username: '',
                                },
                                refreshToken: '',
                                accessToken: '',
                                isAuthenticated: false,
                                errors: error?.error,
                                isLoadingLogin: false,
                                isLoadingLogout: false,

                            })
                        )
                    )
                )
            )
        )
    );


    checkTokenEffect = createEffect(() =>
        this.actions$.pipe(
            ofType(checkTokenAction),
            exhaustMap(() =>
                this.authService.fetchCheckAuthenticated().pipe(
                    map((response: any) => {



                        return response ? checkTokenActionSuccess() : checkTokenActionFail()
                    }
                    ),
                    catchError(() => of(checkTokenActionFail()))
                )
            )
        )
    );

}
