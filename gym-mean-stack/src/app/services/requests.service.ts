import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProgramInterface } from '../models/program-model';

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
