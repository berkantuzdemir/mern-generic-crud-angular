import { Login } from './../model/login';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {
  Authdata!: any;
  apiURL = 'https://mern-generic-crud-angularr.herokuapp.com';
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser = {};

  constructor(private http:HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  postLogin(data: Login): Observable<Login> {
    return this.http
    .post<Login>(this.apiURL + '/api/account/login',data)
    .pipe(retry(1), catchError(this.handleError));
  }

  getUser(): Observable<User[]>{
    const token: any = localStorage.getItem('jwt');
    this.httpOptions.headers = this.httpOptions.headers.set('x-access-token', token)
    return this.http
    .get<User[]>(this.apiURL+ '/api/user', this.httpOptions)
  }
  putUser(formData: User): Observable<User> {
    const token: any = localStorage.getItem('jwt');
    this.httpOptions.headers = this.httpOptions.headers.set('x-access-token', token)
    return this.http
    .put<User>(this.apiURL + '/api/user', formData , this.httpOptions)
    .pipe(retry(1), catchError(this.handleError));
  }

  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }
}
