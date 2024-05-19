import { Injectable } from '@angular/core';
import { RequestsService } from './requests.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { shareReplay, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private requestsService: RequestsService,
    private http: HttpClient,
    private router: Router
  ) {}

  login(email: string, password: string) {
    return this.requestsService.login(email, password).pipe(
      shareReplay(),
      tap((res) => {
        this.setSession(
          res.body?._id,
          res.headers.get('x-access-token'),
          res.headers.get('x-refresh-token')
        );
      })
    );
  }

  signup(email: string, password: string) {
    return this.requestsService.signup(email, password).pipe(
      shareReplay(),
      tap((res) => {
        this.setSession(
          res.body?._id,
          res.headers.get('x-access-token'),
          res.headers.get('x-refresh-token')
        );
      })
    );
  }

  logout() {
    this.removeSession();
    this.router.navigate(['/login']);
  }

  setSession(userId: string, accessToken: string, refreshToken: string) {
    localStorage.setItem('userId', userId);
    localStorage.setItem('x-access-token', accessToken);
    localStorage.setItem('x-refresh-token', refreshToken);
  }

  removeSession() {
    localStorage.removeItem('userId');
    localStorage.removeItem('x-access-token');
    localStorage.removeItem('x-refresh-token');
  }

  getAccessToken() {
    return localStorage.getItem('x-access-token');
  }

  getRefreshToken() {
    return localStorage.getItem('x-refresh-token');
  }

  getUserId() {
    // console.log(localStorage.getItem('userId'));
    return localStorage.getItem('userId');
  }

  setAccessToken(accessToken: string) {
    return localStorage.setItem('x-access-token', accessToken);
  }

  getNewAccessToken() {
    return this.http
      .get(`${this.requestsService.baseUrl}/users/me/access-token`, {
        headers: {
          'x-refresh-token': this.getRefreshToken() as string,
          _id: this.getUserId() as string,
        },
        observe: 'response',
      })
      .pipe(
        tap((res) => {
          this.setAccessToken(res.headers.get('x-access-token') as string);
        })
      );
  }
}
