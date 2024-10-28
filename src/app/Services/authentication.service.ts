import { formatDate, getLocaleDateFormat } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DeferBlockBehavior } from '@angular/core/testing';
import { AuthResponse } from '../Interfaces/interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {


  constructor(
    private http: HttpClient
  ) { }

  serverUrl: string = "http://localhost:8080"

  login(email: string, password: string): Observable<any>{
    const requestBody = {
      email: email,
      password: password
    }
    return this.http.post(`${this.serverUrl}/api/v1/auth/login`, requestBody)

  }
  
  signup(name: string, surname: string, email: string, password: string, birthdate: Date): Observable<any>{
    const requestBody = {
      name: name,
      surname: surname,
      email: email,
      password: password,
      birthdate: formatDate(birthdate, "yyyy-MM-dd", "en-US")

    }
    console.log(requestBody)

    return this.http.post(`${this.serverUrl}/api/v1/auth/signup`, requestBody)
      
  }


  storeToken(token: string){
    // TODO to cypher
    localStorage.setItem("token", token)
  }



}
