import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RequestsService } from '../../../services/requests.service';
import { ProgramInterface } from '../../../models/program.model';
import { NgFor } from '@angular/common';
//import { ProgramInterface } from '../../../models/program-model';

@Component({
  selector: 'app-programs-page',
  standalone: true,
  imports: [NgFor],
  templateUrl: './programs-page.component.html',
  styleUrl: './programs-page.component.scss',
})
export class ProgramsPageComponent implements OnInit {
  programs!: ProgramInterface[];

  constructor(
    private router: Router,
    private requestsService: RequestsService
  ) {}

  ngOnInit(): void {
    this.requestsService
      .getPrograms()
      .subscribe((programs: ProgramInterface[]) => {
        this.programs = programs;
      });
  }

  addNewProgram() {
    this.router.navigate(['new-program']);
  }

  goToSelectedProgram(programId: string | undefined) {
    this.router.navigate([`/programs/${programId}/mg-lists`]);
  }

  deleteProgramOnClikc(programId: string) {
    this.requestsService.deleteProgram(programId);
  }

  editProgramClick(programId: string | undefined) {
    this.router.navigate([`programs/${programId}`]);
  }
}

// u editu user dodaje sliku ako zeli u suprotnom kartica ce imati difoltnu sliku
// takodje u new program   -||-
// uradjen primemr u mongo db vezbba projektu
//
// treba izmeniti objekte (program. mg, exer) - dodati nove propertije kao na promer sliku ili tako nesto a exercise ce imati sve propertije kao i exercise u gymAPiju
