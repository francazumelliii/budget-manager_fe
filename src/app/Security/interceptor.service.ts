import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthenticationService } from '../Services/authentication.service';

@Injectable()
export class Interceptor implements HttpInterceptor {
  private isTokenValidated = false;

  constructor(private authService: AuthenticationService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.authService.token;
    const excludedUrls = ['/api/v1/auth/login', '/api/v1/auth/signup'];
    if (excludedUrls.some((url) => req.url.includes(url))) {
      return next.handle(req); 
    }

    if (token) {
      if (this.isTokenValidated) {
        return next.handle(req);
      } else {
        return this.authService.validateToken().pipe(
          switchMap(() => {
            this.isTokenValidated = true;
            return next.handle(req);
          }),
          catchError((error) => {
            if (error.status === 403 || error.status === 401) {
              this.authService.logOut();
            }
            return throwError(() => error);
          })
        );
      }
    }

    this.authService.logOut();
    return throwError(() => new Error('Token Not Found'));
  }
}
