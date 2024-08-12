import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { IsLoggedInService } from '../../../services/is-logged-in.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  isLoggedIn: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private isLoggedInService: IsLoggedInService
  ) {}

  ngOnInit(): void {
    this.isLoggedInService.getAuthState().subscribe((data: boolean) => {
      console.log(data);
      this.isLoggedIn = data;
    });
  }

  goToSignupPage() {
    this.router.navigate(['signup']);
  }

  login(email: string, password: string) {
    this.authService.login(email, password).subscribe((resUser) => {
      if (resUser.status === 200) {
        this.router.navigate(['programs']);
        this.isLoggedIn = true;
        this.isLoggedInService.loggedIn = this.isLoggedIn;
        this.isLoggedInService.loggedIn$.next(this.isLoggedIn);
      } else {
        alert('Wrong email or password!!!');
      }
    });
  }
}
