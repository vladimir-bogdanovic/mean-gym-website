import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IsLoggedInService {
  constructor() {}

  loggedIn: boolean = false;
  loggedIn$ = new BehaviorSubject<boolean>(false);

  getAuthState() {
    return this.loggedIn$.asObservable();
  }
}
