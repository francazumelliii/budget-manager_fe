import { formatDate, getLocaleDateFormat } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DeferBlockBehavior } from '@angular/core/testing';
import { AuthResponse, User } from '../Interfaces/interface';
import { Observable } from 'rxjs';
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
    this.router.navigate(['authentication'])
  }
}
