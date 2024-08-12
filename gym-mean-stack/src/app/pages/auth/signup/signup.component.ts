import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { IsLoggedInService } from '../../../services/is-logged-in.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent implements OnInit {
  isLoggedIn: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private isLoggedInService: IsLoggedInService
  ) {}

  ngOnInit(): void {
    this.isLoggedInService.getAuthState().subscribe((data: boolean) => {
      this.isLoggedIn = data;
    });
  }

  goToLoginPage() {
    this.router.navigate(['login']);
  }

  signin(email: string, password: string) {
    this.authService.signup(email, password).subscribe((newUser) => {
      console.log('registered successfully');
      console.log(newUser);
      this.isLoggedIn = true;
      this.isLoggedInService.loggedIn = this.isLoggedIn;
      this.isLoggedInService.loggedIn$.next(this.isLoggedIn);
      this.router.navigate(['programs']);
    });
  }
}
