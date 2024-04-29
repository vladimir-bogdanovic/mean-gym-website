import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProgramInterface } from '../models/program.model';
import { Title } from '@angular/platform-browser';
import { MuscleGroupInterface } from '../models/muscle-group.model';
import { ExerciseInterface } from '../models/exercise.model';

@Injectable({
  providedIn: 'root',
})
export class RequestsService {
  baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  createProgram(programName: string): Observable<ProgramInterface> {
    return this.http.post<ProgramInterface>(`${this.baseUrl}/programs`, {
      title: programName,
    });
  }

  getPrograms(): Observable<ProgramInterface[]> {
    return this.http.get<ProgramInterface[]>(`${this.baseUrl}/programs`);
  }

  editProgram(
    programId: string,
    newTitle: string
  ): Observable<ProgramInterface> {
    return this.http.patch<ProgramInterface>(
      `${this.baseUrl}/programs/${programId}`,
      { title: newTitle }
    );
  }

  deleteProgram(programId: string) {
    return this.http.delete(`${this.baseUrl}/programs/${programId}`);
  }

  createMuscleGroup(
    programId: string,
    mgTitle: string
  ): Observable<MuscleGroupInterface> {
    return this.http.post<MuscleGroupInterface>(
      `${this.baseUrl}/programs/${programId}/mg-lists`,
      {
        title: mgTitle,
      }
    );
  }

  getMuscleGroup(programId: string): Observable<MuscleGroupInterface[]> {
    return this.http.get<MuscleGroupInterface[]>(
      `${this.baseUrl}/programs/${programId}/mg-lists`
    );
  }

  editMuscleGroup(
    programId: string,
    mgId: string,
    newTitle: string
  ): Observable<MuscleGroupInterface> {
    return this.http.patch<MuscleGroupInterface>(
      `${this.baseUrl}/programs/${programId}/mg-lists/${mgId}`,
      { title: newTitle }
    );
  }

  deleteMuscleGroup(programId: string, mgListId: string) {
    return this.http.delete(
      `${this.baseUrl}/programs/${programId}/mg-lists/${mgListId}`
    );
  }

  createExercise(
    progrmasId: string,
    mgListId: string,
    exerTitle: string
  ): Observable<ExerciseInterface> {
    return this.http.post<ExerciseInterface>(
      `${this.baseUrl}/programs/${progrmasId}/mg-lists/${mgListId}/exercises`,
      { title: exerTitle }
    );
  }

  getExercises(
    progrmasId: string,
    mgListId: string
  ): Observable<ExerciseInterface[]> {
    return this.http.get<ExerciseInterface[]>(
      `${this.baseUrl}/programs/${progrmasId}/mg-lists/${mgListId}/exercises`
    );
  }

  editExercise(
    progrmasId: string,
    mgListId: string,
    exerciseId: string,
    newTitle: string
  ): Observable<ExerciseInterface> {
    return this.http.patch<ExerciseInterface>(
      `${this.baseUrl}/programs/${progrmasId}/mg-lists/${mgListId}/exercises/${exerciseId}`,
      { title: newTitle }
    );
  }

  deleteExercise(programId: string, mgListId: string, exerciseId: string) {
    return this.http.delete(
      `${this.baseUrl}/programs/${programId}/mg-lists/${mgListId}/exercises/${exerciseId}`
    );
  }

  signup(email: string, password: string): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/users`,
      { email, password },
      { observe: 'response' }
    );
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/users/login`,
      { email, password },
      { observe: 'response' }
    );
  }
}
