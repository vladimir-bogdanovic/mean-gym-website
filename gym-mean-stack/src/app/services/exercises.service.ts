import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { GymApiExerciseInterface } from '../models/gym-api-exercise.model';

@Injectable({
  providedIn: 'root',
})
export class ExercisesService {
  baseAPI = environment.baseAPI;
  apiKey = environment.apiKey;
  rapidHost = environment.rapidHost;

  headers = new HttpHeaders({
    'X-RapidAPI-Key': this.apiKey,
    'X-RapidAPI-Host': this.rapidHost,
  });

  constructor(private http: HttpClient) {}

  getFitnessData(): Observable<GymApiExerciseInterface[]> {
    return this.http.get<GymApiExerciseInterface[]>(this.baseAPI, {
      headers: this.headers,
    });
  }

  getDataForFilter(
    key: string,
    value: string
  ): Observable<GymApiExerciseInterface[]> {
    return this.http.get<GymApiExerciseInterface[]>(
      `${this.baseAPI}?${key}=${value}`,
      {
        headers: this.headers,
      }
    );
  }

  // getMuscleGroupExercises(muscleGroup: string) {
  //   return this.http.get(`${this.baseAPI}?Muscles=${muscleGroup}`, {
  //     headers: this.headers,
  //   });
  // }
}
