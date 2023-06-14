import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap } from 'rxjs/operators';
import * as AuthActions from './auth.actions';
import { environment } from '../../../environments/environment';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable()
export class AuthEffects {
  authLogin = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.LOGIN_START),
      switchMap((authData: AuthActions.LoginStart) => {
        return this.http
          .post<AuthResponseData>(
            'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyDb0xTaRAoxyCgvaDF3kk5VYOsTwB_3o7Y',
            {
              email: authData.payload.email,
              password: authData.payload.password,
              returnSecureToken: true,
            }
          )
          .pipe(
            
            map((resData) => {
              const expirationDate = new Date(new Date().getTime() + +restData.expiresIn * 1000);
              return of(new AuthActions.Login({email: resData.email, userId: resData.localId, token: resData.idToken, expirationDate:expirationDate }));
            }),
            catchError((error) => {
              return of();
            })
          );
      })
    );
  );

  constructor(private actions$: Actions, protected http: HttpClient) {}
}
