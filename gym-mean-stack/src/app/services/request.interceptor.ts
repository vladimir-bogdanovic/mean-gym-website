// import {
//   HttpErrorResponse,
//   HttpEvent,
//   HttpHandler,
//   HttpInterceptor,
//   HttpRequest,
// } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { AuthService } from './auth.service';
// import {
//   Observable,
//   catchError,
//   empty,
//   switchMap,
//   tap,
//   throwError,
// } from 'rxjs';

// @Injectable({
//   providedIn: 'root',
// })
// export class RequestInterceptor implements HttpInterceptor {
//   constructor(private authService: AuthService) {}

//   refreshingAccessToken!: boolean;

//   intercept(
//     req: HttpRequest<any>,
//     next: HttpHandler
//   ): Observable<HttpEvent<any>> {
//     req = this.addAuthHeader(req);

//     return next.handle(req).pipe(
//       catchError((error: HttpErrorResponse) => {
//         console.log(error);

//         if (error.status === 401 && !this.refreshingAccessToken) {
//           return this.refreshAccessToken().pipe(
//             switchMap(() => {
//               req = this.addAuthHeader(req);
//               return next.handle(req);
//             }),
//             catchError((err: any) => {
//               console.log(err);
//               console.log('refresh token has expired');
//               this.authService.logout();
//               return empty();
//             })
//           );
//         }

//         return throwError(() => error);
//       })
//     );
//   }

//   refreshAccessToken() {
//     this.refreshingAccessToken = true;
//     return this.authService.getNewAccessToken().pipe(
//       tap(() => {
//         console.log('access token refreshed');
//         this.refreshingAccessToken = false;
//       })
//     );
//   }

//   addAuthHeader(request: HttpRequest<any>) {
//     const token = this.authService.getAccessToken();
//     if (token) {
//       return request.clone({
//         setHeaders: {
//           'x-access-token': token,
//         },
//       });
//     }
//     return request;
//   }
// }

import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import {
  Observable,
  BehaviorSubject,
  catchError,
  filter,
  switchMap,
  take,
  throwError,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RequestInterceptor implements HttpInterceptor {
  private refreshingAccessToken = false;
  private accessTokenSubject: BehaviorSubject<string | null> =
    new BehaviorSubject<string | null>(null);

  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    req = this.addAuthHeader(req);

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error);

        if (error.status === 401) {
          return this.handle401Error(req, next);
        }

        return throwError(() => error);
      })
    );
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler) {
    if (!this.refreshingAccessToken) {
      this.refreshingAccessToken = true;
      this.accessTokenSubject.next(null);

      return this.authService.getNewAccessToken().pipe(
        switchMap((newToken: any) => {
          this.refreshingAccessToken = false;
          this.accessTokenSubject.next(newToken);
          req = this.addAuthHeader(req);
          return next.handle(req);
        }),
        catchError((err: any) => {
          this.refreshingAccessToken = false;
          console.log('Refresh token has expired or failed', err);
          this.authService.logout();
          return throwError(() => err);
        })
      );
    } else {
      return this.accessTokenSubject.pipe(
        filter((token) => token !== null),
        take(1),
        switchMap((token) => {
          req = this.addAuthHeader(req);
          return next.handle(req);
        })
      );
    }
  }

  private addAuthHeader(request: HttpRequest<any>): HttpRequest<any> {
    const token = this.authService.getAccessToken();
    if (token) {
      return request.clone({
        setHeaders: {
          'x-access-token': token,
        },
      });
    }
    return request;
  }
}
