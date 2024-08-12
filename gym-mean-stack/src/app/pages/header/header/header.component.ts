import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { IsLoggedInService } from '../../../services/is-logged-in.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  loggedIn: boolean = false;
  accessToken!: string | null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private isLoggedInService: IsLoggedInService
  ) {}

  ngOnInit(): void {
    this.accessToken = this.authService.getAccessToken();
    if (this.accessToken === null) {
      this.loggedIn = false;
    } else {
      this.loggedIn = true;
    }
    this.isLoggedInService.getAuthState().subscribe((data: boolean) => {
      this.loggedIn = data;
    });
  }

  logout() {
    this.authService.logout();
    this.loggedIn = false;

    this.isLoggedInService.loggedIn = this.loggedIn;
    this.isLoggedInService.loggedIn$.next(this.loggedIn);
  }

  goToSignupPage() {
    this.router.navigate(['signup']);
  }

  goToLoginPage() {
    this.router.navigate(['login']);
  }

  goToHomePage() {
    this.router.navigate(['home']);
  }

  goToProgramsPage() {
    this.router.navigate(['programs']);
  }

  goToExercisesPage() {
    this.router.navigate(['exercises']);
  }
}
