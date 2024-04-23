import { Component } from '@angular/core';
import { RequestsService } from '../../../services/requests.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-new-exercise',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './new-exercise.component.html',
  styleUrl: './new-exercise.component.scss',
})
export class NewExerciseComponent {
  inputValue!: string;
  programId!: string;
  muscleGroupId!: string;

  constructor(
    private requestsService: RequestsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  createNewExercise() {
    this.route.params.subscribe((param: Params) => {
      this.programId = param?.['programId'];
      this.muscleGroupId = param?.['mgListId'];
    });

    this.requestsService
      .createExercise(this.programId, this.muscleGroupId, this.inputValue)
      .subscribe(() => {
        this.router.navigate([
          `programs/${this.programId}/mg-lists/${this.muscleGroupId}/exercises`,
        ]);
      });
  }
}
