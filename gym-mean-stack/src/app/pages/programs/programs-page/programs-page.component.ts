import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-programs-page',
  standalone: true,
  imports: [],
  templateUrl: './programs-page.component.html',
  styleUrl: './programs-page.component.scss',
})
export class ProgramsPageComponent {
  constructor(private router: Router) {}

  addNewProgram() {
    this.router.navigate(['new-program']);
  }
}
