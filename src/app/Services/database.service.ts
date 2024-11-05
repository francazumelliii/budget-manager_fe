import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
    ) {}

    serverUrl: string = "http://localhost:8080/api/v1"


    get(endpoint: string): Observable<any>{
      console.log(`%c GET REQUEST: ${this.serverUrl}${endpoint}`, "color:#14b8a6;")
      return this.http.get(`${this.serverUrl}${endpoint}`, {headers: this.headers});
    } 

    post(endpoint: string, body: any): Observable<any>{
      console.log(`%c POST REQUEST: ${this.serverUrl}${endpoint}`, "color:#ef4444;")
      return this.http.post(`${this.serverUrl}${endpoint}`, body, {headers: this.headers});
    } 
    put(endpoint: string, body: any): Observable<any>{
      console.log(`%c PUT REQUEST: ${this.serverUrl}${endpoint}`, "color:#33aaff;")
      return this.http.put(`${this.serverUrl}${endpoint}`, body, {headers: this.headers});
    } 
    patch(endpoint: string, body: any): Observable<any>{
      console.log(`%c PATCH REQUEST: ${this.serverUrl}${endpoint}`, "color:#eab308;")
      return this.http.patch(`${this.serverUrl}${endpoint}`, body, {headers: this.headers});
    } 
    delete(endpoint: string): Observable<any>{
      console.log(`%c DELETE REQUEST: ${this.serverUrl}${endpoint}`, "color:#d946ef")
      return this.http.post(`${this.serverUrl}${endpoint}`, {headers: this.headers});
    } 
    
    

    get headers(): HttpHeaders{
      const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.token}`);
      return headers
    }
}
