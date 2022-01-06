import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {FbAuthResponse, User} from '../../../shared/interfaces';
import {Observable, of, Subject, throwError} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {catchError, tap} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class AuthService {
  public error$: Subject<string> = new Subject<string>();

  constructor(
    private http: HttpClient
  ) {
  }

  get token(): string {
    const expDate = new Date(localStorage.getItem('fb-idToken-exp'));
    if (new Date() > expDate) {
      this.logOut();
      return null;
    }
    return localStorage.getItem('fb-idToken');
  }

  logIn(user: User): Observable<any> {
    user.returnSecureToken = true;
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, user)
      .pipe(
        tap(this.setToken),
        catchError(this.handleError.bind(this))
      )
  }

  logOut() {
    this.setToken(null)
  }

  isAuthenticated() {
    return !!this.token
  }

  private handleError(err: HttpErrorResponse) {
    const {message} = err.error.error;
    switch (message) {
      case 'EMAIL_NOT_FOUND':
        this.error$.next('email not found');
        break;
      case 'INVALID_EMAIL':
        this.error$.next('wrong email');
        break;
      case 'INVALID_PASSWORD':
        this.error$.next('wrong password');
        break;
    }
    return throwError(err)
  }

  private setToken(resp: FbAuthResponse | null) {
    if (resp) {
      const expDate = new Date(new Date().getTime() + +resp.expiresIn * 1000);
      localStorage.setItem('fb-idToken', resp.idToken);
      localStorage.setItem('fb-idToken-exp', expDate.toString());
    } else {
      localStorage.clear();
    }
  }
}
