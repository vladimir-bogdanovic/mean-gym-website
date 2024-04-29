import { Component, OnInit } from '@angular/core';
import { RequestsService } from '../../../services/requests.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-exercise',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-exercise.component.html',
  styleUrl: './edit-exercise.component.scss',
})
export class EditExerciseComponent implements OnInit {
  inputValue!: string;
  programId!: string;
  muscleGroupId!: string;
  exerciseId!: string;

  constructor(
    private requestsService: RequestsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((param: Params) => {
      this.programId = param?.['programId'];
      this.muscleGroupId = param?.['mgListId'];
      this.exerciseId = param?.['exerciseId'];
    });
  }

  editExercise() {
    this.requestsService
      .editExercise(
        this.programId,
        this.muscleGroupId,
        this.exerciseId,
        this.inputValue
      )
      .subscribe(() => {
        this.router.navigate([
          `programs/${this.programId}/mg-lists/${this.muscleGroupId}/exercises/${this.exerciseId}`,
        ]);
      });
  }

  cancelButton() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
