import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  constructor(private router: Router, private authService: AuthService) {}

  goToSignupPage() {
    this.router.navigate(['signup']);
  }

  login(email: string, password: string) {
    this.authService.login(email, password).subscribe((user) => {
      console.log(user);
      console.log('login successfull');
    });
  }
}
