import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { URL_BASE } from './utils/endpoints';

@Injectable({
  providedIn: 'root',
})
export class TripsService {
  private siteURL = URL_BASE;
  private http = inject(HttpClient);

  // 🔹 Cargar todos los viajes por usuario (lo que ya tienes)
  fetchLoadAllTrips(idUser: number): Observable<any> {
    return this.http.get<any>(`${this.siteURL}/trips/${idUser}`).pipe(
      catchError(error => throwError(() => error))
    );
  }

  // 🔹 Cargar viajes por usuario y fecha
  fetchTripsByUserAndDate(idUser: number, date: string): Observable<any> {
    return this.http.get<any>(
      `${this.siteURL}/trips/bydate/${idUser}?date_created=${date}`
    ).pipe(
      catchError(error => throwError(() => error))
    );
  }
}
