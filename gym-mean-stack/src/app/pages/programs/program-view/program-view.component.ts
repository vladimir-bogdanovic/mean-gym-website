import { Component, OnDestroy, OnInit } from '@angular/core';
import { RequestsService } from '../../../services/requests.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { MuscleGroupInterface } from '../../../models/muscle-group.model';
import { ExerciseInterface } from '../../../models/exercise.model';
import { ProgramInterface } from '../../../models/program.model';
import { Subscription, switchMap } from 'rxjs';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-program-view',
  standalone: true,
  imports: [NgFor, NgIf, CommonModule, RouterModule],
  templateUrl: './program-view.component.html',
  styleUrl: './program-view.component.scss',
})
export class ProgramViewComponent implements OnInit, OnDestroy {
  constructor(
    private requestsService: RequestsService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  programId!: string;
  muscleGroupId!: string;
  exerciseId!: string;

  muscleGroups!: MuscleGroupInterface[];
  exercises!: ExerciseInterface[];

  programTitle!: string | undefined;
  muscleGroupTitle!: string | undefined;

  programsSubscription!: Subscription;
  muscleGroupsSubscription!: Subscription;
  exercisesSubscription!: Subscription;

  ngOnInit(): void {
    this.requestsService.getPrograms();
    this.programsSubscription = this.requestsService
      .getProgramsStream()
      .subscribe((programs: ProgramInterface[]) => {
        programs.filter((program: ProgramInterface) => {
          if (program._id === this.programId) {
            this.programTitle = program.title;
          }
        });
      });

    this.route.params.subscribe((params: Params) => {
      this.programId = params?.['programId'];

      this.requestsService.getMuscleGroup(this.programId);
      this.muscleGroupsSubscription = this.requestsService
        .getMuscleGroupsStream()
        .subscribe((muscleGroups: MuscleGroupInterface[]) => {
          this.muscleGroups = muscleGroups;
          muscleGroups.filter((muscleGroups: ProgramInterface) => {
            if (muscleGroups._id === this.muscleGroupId) {
              this.muscleGroupTitle = muscleGroups.title;
            }
          });
          // console.log(this.muscleGroups);
        });

      if ((this.muscleGroupId = params?.['mgListId'])) {
        this.requestsService.getExercises(this.programId, this.muscleGroupId);
        this.exercisesSubscription = this.requestsService
          .getExercisesStream()
          .subscribe((exercises) => {
            this.exercises = exercises;
          });
      } else {
        this.exercises = undefined!;
      }
    });
  }

  createNewMucleGroup() {
    this.router.navigate([`programs/${this.programId}/new-muscle-group`]);
  }

  createNewExercise() {
    this.router.navigate([
      `programs/${this.programId}/mg-lists/${this.muscleGroupId}/new-exercise`,
    ]);
  }

  editMuscleGroup() {
    this.router.navigate([
      `programs/${this.programId}/mg-lists/${this.muscleGroupId}/edit-muscle-group`,
    ]);
  }

  deleteMuscleGroup() {
    console.log('deleteing muscle group');
    this.requestsService.deleteMuscleGroup(this.programId, this.muscleGroupId);
    this.muscleGroupsSubscription = this.requestsService
      .getMuscleGroupsStream()
      .pipe(switchMap(() => this.requestsService.getMuscleGroupsStream()))
      .subscribe((muscleGroups: MuscleGroupInterface[]) => {
        this.muscleGroups = muscleGroups;
      });
  }

  editExercicse(exerciseId: string | undefined) {
    this.router.navigate([
      `programs/${this.programId}/mg-lists/${this.muscleGroupId}/exercises/${exerciseId}/edit-exercise`,
    ]);
  }

  deleteExercise(exerciseId: string) {
    this.requestsService.deleteExercise(
      this.programId,
      this.muscleGroupId,
      exerciseId
    );
    this.exercisesSubscription = this.requestsService
      .getExercisesStream()
      .pipe(switchMap(() => this.requestsService.getExercisesStream()))
      .subscribe((exercises: ExerciseInterface[]) => {
        this.exercises = exercises;
      });
  }

  ngOnDestroy(): void {
    if (this.programsSubscription) {
      this.programsSubscription.unsubscribe();
    }
    if (this.muscleGroupsSubscription) {
      this.muscleGroupsSubscription.unsubscribe();
    }
    if (this.exercisesSubscription) {
      this.exercisesSubscription.unsubscribe();
    }
  }
}
