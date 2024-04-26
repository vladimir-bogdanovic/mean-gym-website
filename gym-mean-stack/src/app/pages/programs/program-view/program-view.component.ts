import { Component, OnInit } from '@angular/core';
import { RequestsService } from '../../../services/requests.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { MuscleGroupInterface } from '../../../models/muscle-group.model';
import { ExerciseInterface } from '../../../models/exercise.model';
import { ProgramInterface } from '../../../models/program.model';

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
  programTitle!: string | undefined;

  ngOnInit(): void {
    this.requestsService
      .getPrograms()
      .subscribe((programs: ProgramInterface[]) => {
        programs.filter((program: ProgramInterface) => {
          if (program._id === this.programId) {
            this.programTitle = program.title;
            console.log(this.programTitle);
          }
        });
      });

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

  createNewExercise() {
    this.router.navigate([
      `programs/${this.programId}/mg-lists/${this.muscleGroupId}/new-exercise`,
    ]);
  }
}

// tomorow fix css in programs-page and add edit/delete buttons
