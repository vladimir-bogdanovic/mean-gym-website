import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { NgIf } from '@angular/common';

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

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.accessToken = this.authService.getAccessToken();
    console.log(this.accessToken);
    if (this.accessToken === null) {
      this.loggedIn = false;
    } else {
      this.loggedIn = true;
    }
  }
}
