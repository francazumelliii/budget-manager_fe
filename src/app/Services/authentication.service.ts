import { formatDate, getLocaleDateFormat } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DeferBlockBehavior } from '@angular/core/testing';
import { AuthResponse, User } from '../Interfaces/interface';
import { catchError, map, Observable, of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private http: HttpClient, private router: Router) {}

  serverUrl: string = 'http://localhost:8080';

  login(email: string, password: string): Observable<any> {
    const requestBody = {
      email: email,
      password: password,
    };
    return this.http.post(`${this.serverUrl}/api/v1/auth/login`, requestBody);
  }

  signup(
    name: string,
    surname: string,
    email: string,
    password: string,
    birthdate: Date
  ): Observable<any> {
    const requestBody = {
      name: name,
      surname: surname,
      email: email,
      password: password,
      birthdate: formatDate(birthdate, 'yyyy-MM-dd', 'en-US'),
    };
    console.log(requestBody);

    return this.http.post(`${this.serverUrl}/api/v1/auth/signup`, requestBody);
  }

  storeToken(token: string) {
    if (typeof localStorage !== 'undefined') {
      // TODO to cypher
      localStorage.setItem('token', token);
      this.router.navigate(['homepage']);
    }
  }

  get token() {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      return token ? token : null;
    }
    return null;
  }

  storeUserInformation(user: any) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  get userInformation() {
    if (typeof localStorage !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }


  logOut(){
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("notification")
    this.router.navigate(['authentication'])
  }

  get role(){
    return this.userInformation.role
  }

  storeNotification(){
    localStorage.setItem("notification", "shown")
  }

  setDefaultCurrency(value: string = '€'){
    localStorage.setItem("currency", value ?? '€')
  }

  get defaultCurrency(){
    return localStorage.getItem("currency")
  }

  redirect(url: string): void{
    console.log(`%c REDIRECT: /${url}`, "color:#d9f99d;")

    this.router.navigate([`/${url}`]);
  }

  validateToken() {
    console.log('AuthenticationService - Validating token...');
  
    const token = localStorage.getItem("token");
    
    if (!token) {
      console.log('AuthenticationService - No token found');
      return of(false);  
    }
    
    const headers: HttpHeaders = new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });
  
    return this.http.get(`${this.serverUrl}/api/v1/auth/validate`, { headers })
      .pipe(
        map((response: any) => {
          console.log('AuthenticationService - Token validation response:', response);
          if (response && response.isValid) {
            console.log('AuthenticationService - Token is valid');
            return true;
          } else {
            console.log('AuthenticationService - Token is invalid');
            return false;
          }
        }),
        catchError((error) => {
          console.error('AuthenticationService - Error during token validation', error);
          return of(false);  
        })
      );
  }
  
  
}
