import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthenticationService } from '../Services/authentication.service';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);

  console.log('authGuard - Checking if token is valid...');

  return authService.validateToken().pipe(
    map((isValid) => {
      if (isValid) {
        console.log('authGuard - Token is valid');
        return true;
      } else {
        console.log('authGuard - Token is invalid');
        authService.logOut()
        return false;
      }
    }),
    catchError((error) => {
      console.log('authGuard - Token validation failed, logging out...');
      authService.logOut();
      console.log('authGuard - User logged out');
      return of(false);
    })
  );
};


