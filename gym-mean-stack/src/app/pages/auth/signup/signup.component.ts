import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  constructor(private router: Router, private authService: AuthService) {}

  goToLoginPage() {
    this.router.navigate(['login']);
  }

  signin(email: string, password: string) {
    this.authService.signup(email, password).subscribe((newUser) => {
      console.log('registered successfully');
      console.log(newUser);
    });
  }
}
