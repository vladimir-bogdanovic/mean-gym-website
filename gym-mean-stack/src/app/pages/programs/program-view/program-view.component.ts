import { Component, OnDestroy, OnInit } from '@angular/core';
import { RequestsService } from '../../../services/requests.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { MuscleGroupInterface } from '../../../models/muscle-group.model';
import { ExerciseInterface } from '../../../models/exercise.model';
import { ProgramInterface } from '../../../models/program.model';
import { Subscription, switchMap } from 'rxjs';

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
    private router: Router,
    private route: ActivatedRoute
  ) {}

  programId!: string;
  muscleGroupId!: string;
  exerciseId!: string;

  muscleGroups!: MuscleGroupInterface[];
  exercises!: ExerciseInterface[];
  programTitle!: string | undefined;

  muscleGroupsSubscription!: Subscription;

  ngOnInit(): void {
    this.requestsService.getPrograms();
    this.requestsService
      .getProgramsStream()
      .subscribe((programs: ProgramInterface[]) => {
        programs.filter((program: ProgramInterface) => {
          if (program._id === this.programId) {
            this.programTitle = program.title;
            //   console.log(this.programTitle);
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
          console.log(this.muscleGroups);
        });

      if ((this.muscleGroupId = params?.['mgListId'])) {
        //   console.log('asdas', this.muscleGroupId);
        this.requestsService.getExercises(this.programId, this.muscleGroupId);
        this.requestsService.getExercisesStream().subscribe((exercises) => {
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

  editMuscleGroupClick() {
    this.router.navigate([
      `programs/${this.programId}/mg-lists/${this.muscleGroupId}/edit-muscle-group`,
    ]);
  }

  deleteMuscleGroup() {
    console.log('deleteing muscle group');
    this.requestsService.deleteMuscleGroup(this.programId, this.muscleGroupId);
    this.requestsService
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
    this.requestsService
      .deleteExercise(this.programId, this.muscleGroupId, exerciseId)
      .subscribe(() => {
        console.log('exercise deleted');
      });
  }

  ngOnDestroy(): void {
    this.muscleGroupsSubscription.unsubscribe();
  }
}
