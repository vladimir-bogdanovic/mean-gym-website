import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, map } from 'rxjs';
import { ProgramInterface } from '../models/program.model';
import { Title } from '@angular/platform-browser';
import { MuscleGroupInterface } from '../models/muscle-group.model';
import { ExerciseInterface } from '../models/exercise.model';

@Injectable({
  providedIn: 'root',
})
export class RequestsService {
  baseUrl = 'http://localhost:3000';
  private programs: ProgramInterface[] = [];
  private programs$ = new Subject<ProgramInterface[]>();

  constructor(private http: HttpClient) {}

  createProgram(name: string, image: any) {
    if (typeof image === 'string') {
      const blob = new Blob([image], { type: 'text/plain' });
      image = blob;
      console.log(image);
    }
    if (!(image instanceof File || image instanceof Blob)) {
      console.error(
        'The provided image is not a Blob or File. Received:',
        typeof image
      );
      throw new Error('The provided image is not a Blob or File.');
    }
    // Create FormData object
    const programData = new FormData();
    programData.append('title', name);
    // Handle different types of image input
    if (image instanceof File) {
      programData.append('image', image, image.name);
    } else {
      // If image is not a File, assume it's a Blob
      programData.append('image', image, 'image.txt');
    }
    this.http
      .post<ProgramInterface>(`${this.baseUrl}/programs`, programData, {})
      .subscribe((programData: ProgramInterface) => {
        const program: ProgramInterface = {
          title: name,
          imagePath: programData.imagePath,
          _id: programData._id,
        };
        this.programs.push(program);
        this.programs$.next(this.programs);
      });
  }

  getPrograms() {
    this.http
      .get<ProgramInterface[]>(`${this.baseUrl}/programs`)
      .pipe(
        map((programData) => {
          return programData;
        })
      )
      .subscribe((programs: ProgramInterface[]) => {
        this.programs = programs;
        this.programs$.next(this.programs);
      });
  }

  getProgramsStream() {
    return this.programs$.asObservable();
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
