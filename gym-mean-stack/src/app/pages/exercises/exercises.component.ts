import { Component, OnInit } from '@angular/core';
import { ExercisesService } from '../../services/exercises.service';
import { GymApiExerciseInterface } from '../../models/gym-api-exercise.model';
import { NgFor } from '@angular/common';
import { ShortenLinkPipe } from '../../pipes/shorten-link.pipe';

@Component({
  selector: 'app-exercises',
  standalone: true,
  imports: [NgFor, ShortenLinkPipe],
  templateUrl: './exercises.component.html',
  styleUrl: './exercises.component.scss',
})
export class ExercisesComponent implements OnInit {
  exercises!: GymApiExerciseInterface[];

  constructor(private exerciseService: ExercisesService) {}

  ngOnInit(): void {
    this.exerciseService
      .getFitnessData()
      .subscribe((resData: GymApiExerciseInterface[]) => {
        this.exercises = resData;
      });
  }
}
