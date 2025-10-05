
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Conductor } from '../models/conductor.model';
import { URL_BASE } from './utils/endpoints';
import { getAuthDataFromLocalStorage } from './utils/localstorage-functions';


@Injectable({
  providedIn: 'root',
})
export class ConductorService {
  private siteURL = URL_BASE
  private http = inject(HttpClient)


  fetchLoadAllConductores(): Observable<any> {
    const { accessToken }: any = getAuthDataFromLocalStorage();
    return this.http.post<any>(`${this.siteURL}/admin/login`, { headers: { Authorization: `Bearer ${accessToken}` } }).pipe(
      catchError(error => throwError(error))
    );
  }
  fetchLoadConductores(query: any): Observable<any> {

    return this.http.get<any>(`${this.siteURL}/users`, query).pipe(
      catchError(error => throwError(error))
    );
  }

  fetchCreateConductor(conductor: Conductor): Observable<any> {

    return this.http.post<any>(`${this.siteURL}/user/register`, { ...conductor }).pipe(
      catchError(error => {
        console.log(error)
        return throwError(error);
      })
    );
  }
}
