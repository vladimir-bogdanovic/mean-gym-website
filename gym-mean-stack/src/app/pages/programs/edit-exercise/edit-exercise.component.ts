import { Component, OnDestroy, OnInit } from '@angular/core';
import { RequestsService } from '../../../services/requests.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-exercise',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './edit-exercise.component.html',
  styleUrl: './edit-exercise.component.scss',
})
export class EditExerciseComponent implements OnInit, OnDestroy {
  programId!: string;
  muscleGroupId!: string;
  exerciseId!: string;

  exerciseForm!: FormGroup;
  private exercisesSubscription: Subscription = new Subscription();

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

    this.exerciseForm = new FormGroup({
      exerciseName: new FormControl(null),
    });
  }

  onSubmit() {
    console.log('sda');
    this.requestsService.editExercise(
      this.programId,
      this.muscleGroupId,
      this.exerciseId,
      this.exerciseForm.value.exerciseName
    );
    this.exercisesSubscription = this.requestsService
      .getExercisesStream()
      .subscribe();
    this.router.navigate([
      `programs/${this.programId}/mg-lists/${this.muscleGroupId}/exercises`,
    ]);
  }

  cancelButton() {
    this.router.navigate([
      `programs/${this.programId}/mg-lists/${this.muscleGroupId}/exercises`,
    ]);
  }

  ngOnDestroy(): void {
    this.exercisesSubscription.unsubscribe();
  }
}
