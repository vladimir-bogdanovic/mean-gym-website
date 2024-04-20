import { Component } from '@angular/core';
import { RequestsService } from '../../../services/requests.service';
import { ProgramInterface } from '../../../models/program-model';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-new-program',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './new-program.component.html',
  styleUrl: './new-program.component.scss',
})
export class NewProgramComponent {
  constructor(
    private requestsService: RequestsService,
    private router: Router
  ) {}

  inputValue!: string;

  createNewProgram() {
    this.requestsService
      .createProgram(this.inputValue)
      .subscribe((program: ProgramInterface) => {
        console.log(program);
        this.router.navigate([`/programs/${program._id}/program-view`]);
      });
  }
}
