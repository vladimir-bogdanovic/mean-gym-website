import { Component, OnInit } from '@angular/core';
import { RequestsService } from '../../../services/requests.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ExerciseInterface } from '../../../models/exercise.model';

@Component({
  selector: 'app-new-exercise',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './new-exercise.component.html',
  styleUrl: './new-exercise.component.scss',
})
export class NewExerciseComponent implements OnInit {
  inputValue!: string;
  programId!: string;
  muscleGroupId!: string;
  exerciseForm!: FormGroup;

  constructor(
    private requestsService: RequestsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((param: Params) => {
      this.programId = param?.['programId'];
      this.muscleGroupId = param?.['mgListId'];
    });

    this.exerciseForm = new FormGroup({
      exerciseName: new FormControl(null),
    });
  }

  onSubmit() {
    console.log('submiting form');
    this.requestsService.createExercise(
      this.programId,
      this.muscleGroupId,
      this.exerciseForm.value.exerciseName
    );
    this.requestsService
      .getExercisesStream()
      .subscribe((exercises: ExerciseInterface[]) => {
        exercises.filter((exercise: ExerciseInterface) => {
          this.router.navigate([
            `programs/${this.programId}/mg-lists/${this.muscleGroupId}/exercises/${exercise._id}`,
          ]);
        });
      });
    console.log(this.exerciseForm.value.exerciseName);
  }

  cancelButton() {
    this.router.navigate([
      `programs/${this.programId}/mg-lists/${this.muscleGroupId}/exercises`,
    ]);
  }
}
