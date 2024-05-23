import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, map } from 'rxjs';
import { ProgramInterface } from '../models/program.model';
import { MuscleGroupInterface } from '../models/muscle-group.model';
import { ExerciseInterface } from '../models/exercise.model';

@Injectable({
  providedIn: 'root',
})
export class RequestsService {
  baseUrl = 'http://localhost:3000';

  private programs: ProgramInterface[] = [];
  private programs$ = new Subject<ProgramInterface[]>();
  private muscleGroups: MuscleGroupInterface[] = [];
  private muscleGroups$ = new Subject<MuscleGroupInterface[]>();
  private exercises: ExerciseInterface[] = [];
  private exercises$ = new Subject<ExerciseInterface[]>();

  constructor(private http: HttpClient) {}

  // PROGRAM REQUESTS

  ///////////////////// POST PROGRAM /////////////////////
  createProgram(name: string, image: any) {
    if (!image) {
      image = 'default-image';
    }

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
      .post<ProgramInterface>(`${this.baseUrl}/programs`, programData)
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

  ///////////////////// GET PROGRAM /////////////////////
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

  ///////////////////// EDIT PROGRAM /////////////////////

  editProgram(programId: string, name: string, image: any) {
    if (!image) {
      image = 'default-image';
    }

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
      .patch<ProgramInterface>(
        `${this.baseUrl}/programs/${programId}`,
        programData,
        {}
      )
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

  ///////////////////// DELETE PROGRAM /////////////////////
  deleteProgram(programId: string) {
    this.http.delete(`${this.baseUrl}/programs/${programId}`).subscribe(() => {
      // Remove the deleted program from the local array
      const index = this.programs.findIndex(
        (program) => program._id === programId
      );
      if (index !== -1) {
        this.programs.splice(index, 1);
        this.programs$.next(this.programs);
      }
    });
  }

  // MUSCLE GROUPS

  ///////////////////// POST MG /////////////////////
  createMuscleGroup(programId: string, name: string) {
    const mgData = { title: name };
    this.http
      .post(`${this.baseUrl}/programs/${programId}/mg-lists`, mgData)
      .subscribe((muscleGroup: MuscleGroupInterface) => {
        const muscle: MuscleGroupInterface = {
          title: muscleGroup.title,
          _id: muscleGroup._id,
          _programId: programId,
        };
        this.muscleGroups.push(muscle);
        this.muscleGroups$.next(this.muscleGroups);
      });
  }

  ///////////////////// GET MG /////////////////////
  getMuscleGroup(programId: string) {
    this.http
      .get<MuscleGroupInterface[]>(
        `${this.baseUrl}/programs/${programId}/mg-lists`
      )
      .subscribe((mgGropus: MuscleGroupInterface[]) => {
        this.muscleGroups = mgGropus;
        this.muscleGroups$.next(this.muscleGroups);
      });
  }

  getMuscleGroupsStream() {
    return this.muscleGroups$.asObservable();
  }

  ///////////////////// PATCH MG /////////////////////
  editMuscleGroup(programId: string, mgId: string, newTitle: string) {
    const newMGData = { title: newTitle };
    this.http
      .patch<MuscleGroupInterface>(
        `${this.baseUrl}/programs/${programId}/mg-lists/${mgId}`,
        newMGData
      )
      .subscribe((muscleGroup: MuscleGroupInterface) => {
        const index = this.muscleGroups.findIndex(
          (mg: MuscleGroupInterface) => mg._id === mgId
        );
        if (index !== -1) {
          this.muscleGroups[index] = {
            _id: muscleGroup._id,
            title: muscleGroup.title,
            _programId: muscleGroup._programId,
          };
        }

        this.muscleGroups$.next(this.muscleGroups);
        //console.log(this.muscleGroups, this.muscleGroups$);
      });
  }

  ///////////////////// DELETE MG /////////////////////
  deleteMuscleGroup(programId: string, mgListId: string) {
    this.http
      .delete(`${this.baseUrl}/programs/${programId}/mg-lists/${mgListId}`)
      .subscribe(() => {
        const index = this.muscleGroups.findIndex(
          (muscleGroup: MuscleGroupInterface) => muscleGroup._id === mgListId
        );
        if (index !== -1) {
          this.muscleGroups.splice(index, 1);
          this.muscleGroups$.next(this.muscleGroups);
        }
      });
  }

  // EXERCISES

  ///////////////////// POST EXERCISE /////////////////////
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

  ///////////////////// POST /////////////////////
  getExercises(
    progrmasId: string,
    mgListId: string
  ): Observable<ExerciseInterface[]> {
    return this.http.get<ExerciseInterface[]>(
      `${this.baseUrl}/programs/${progrmasId}/mg-lists/${mgListId}/exercises`
    );
  }

  ///////////////////// POST /////////////////////
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

  ///////////////////// POST /////////////////////
  deleteExercise(programId: string, mgListId: string, exerciseId: string) {
    return this.http.delete(
      `${this.baseUrl}/programs/${programId}/mg-lists/${mgListId}/exercises/${exerciseId}`
    );
  }

  ///////////////////// POST /////////////////////
  signup(email: string, password: string): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/users`,
      { email, password },
      { observe: 'response' }
    );
  }

  ///////////////////// POST /////////////////////
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/users/login`,
      { email, password },
      { observe: 'response' }
    );
  }
}
