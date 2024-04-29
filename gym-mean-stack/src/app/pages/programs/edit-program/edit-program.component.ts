import { Component, OnInit } from '@angular/core';
import { RequestsService } from '../../../services/requests.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-program',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-program.component.html',
  styleUrl: './edit-program.component.scss',
})
export class EditProgramComponent implements OnInit {
  constructor(
    private requestsService: RequestsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  inputValue!: string;
  programId!: string;

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.programId = params?.['programId'];
      console.log(this.programId);
    });
  }

  editProgram() {
    this.requestsService
      .editProgram(this.programId, this.inputValue)
      .subscribe(() => {
        this.router.navigate(['../'], { relativeTo: this.route });
      });
  }

  cancelButton() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
