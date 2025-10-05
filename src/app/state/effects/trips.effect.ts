import { TripsService } from "@/app/services/trips.service";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import {
    loadTripsByDate,
    loadTripsByDateFail,
    loadTripsByDateSuccess,
    loadTripsByUser,
    loadTripsByUserFail,
    loadTripsByUserSuccess
} from "./trips.actions";

@Injectable()
export class TripsEffects {

    constructor(private actions$: Actions, private tripsService: TripsService) { }

    // 🔹 Cargar viajes por usuario
    loadAllTrips$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadTripsByUser),
            switchMap(({ userId }) =>
                this.tripsService.fetchLoadAllTrips(userId).pipe(
                    map(data => loadTripsByUserSuccess({ trips: data.trips })),
                    catchError(error => of(loadTripsByUserFail({ error })))
                )
            )
        )
    );

    // 🔹 Cargar viajes por usuario + fecha
    loadTripsByDate$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadTripsByDate),
            switchMap(({ userId, date }) =>
                this.tripsService.fetchTripsByUserAndDate(userId, date).pipe(
                    map(data => loadTripsByDateSuccess({ trips: data.trips })),
                    catchError(error => of(loadTripsByDateFail({ error })))
                )
            )
        )
    );

}
