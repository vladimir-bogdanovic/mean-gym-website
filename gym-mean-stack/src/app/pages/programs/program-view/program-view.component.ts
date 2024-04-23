import { Component, OnInit } from '@angular/core';
import { RequestsService } from '../../../services/requests.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { MuscleGroupInterface } from '../../../models/muscle-group.model';
import { ExerciseInterface } from '../../../models/exercise.model';

@Component({
  selector: 'app-program-view',
  standalone: true,
  imports: [NgFor, NgIf, CommonModule, RouterModule],
  templateUrl: './program-view.component.html',
  styleUrl: './program-view.component.scss',
})
export class ProgramViewComponent implements OnInit {
  constructor(
    private requestsService: RequestsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  programId!: string;
  muscleGroupId!: string;
  muscleGroups!: MuscleGroupInterface[];
  exercises!: ExerciseInterface[];

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.programId = params?.['programId'];

      this.requestsService
        .getMuscleGroup(this.programId)
        .subscribe((mgList: MuscleGroupInterface[]) => {
          this.muscleGroups = mgList;
        });

      if ((this.muscleGroupId = params?.['mgListId'])) {
        this.requestsService
          .getExercises(this.programId, this.muscleGroupId)
          .subscribe((exercises) => {
            this.exercises = exercises;
            console.log(exercises);
          });
      } else {
        this.exercises = undefined!;
      }
    });
  }

  createNewMucleGroup() {
    this.router.navigate([`programs/${this.programId}/new-muscle-group`]);
  }

  onAddExerciseClick() {
    this.router.navigate([
      `programs/${this.programId}/mg-lists/${this.muscleGroupId}/new-exercise`,
    ]);
  }
}
