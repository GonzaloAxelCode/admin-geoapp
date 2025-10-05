
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { URL_BASE } from './utils/endpoints';
import { getAuthDataFromLocalStorage } from './utils/localstorage-functions';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private siteURL = URL_BASE
  private http = inject(HttpClient)


  fetchCreateToken(userAuth: any): Observable<any> {
    return this.http.post<any>(`${this.siteURL}/admin/login`, userAuth).pipe(
      catchError(error => throwError(error))
    );
  }

  fetchCheckAuthenticated(): Observable<any> {
    const { accessToken }: any = getAuthDataFromLocalStorage();
    return this.http.post<any>(`${this.siteURL}/auth/jwt/verify/`, { token: accessToken }).pipe(
      catchError(error => {
        console.log(error)
        return throwError(error);
      })
    );
  }
}
