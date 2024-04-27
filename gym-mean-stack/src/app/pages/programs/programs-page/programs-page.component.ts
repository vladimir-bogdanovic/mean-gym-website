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
}

// u editu user dodaje sliku ako zeli u suprotno kartica ce imati difoltnu sliku
// takodje u new program   -||-
