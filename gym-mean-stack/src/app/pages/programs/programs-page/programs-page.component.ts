import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RequestsService } from '../../../services/requests.service';
import { ProgramInterface } from '../../../models/program.model';
import { NgFor, NgIf } from '@angular/common';
import { StringToImagePipe } from '../../../pipes/string-to-image.pipe';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-programs-page',
  standalone: true,
  imports: [NgFor, NgIf, StringToImagePipe],
  templateUrl: './programs-page.component.html',
  styleUrl: './programs-page.component.scss',
})
export class ProgramsPageComponent implements OnInit, OnDestroy {
  programs!: ProgramInterface[];
  private programsSubscription!: Subscription;

  constructor(
    private router: Router,
    private requestsService: RequestsService
  ) {}

  ngOnInit(): void {
    this.requestsService.getPrograms();
    this.programsSubscription = this.requestsService
      .getProgramsStream()
      .subscribe((programs: ProgramInterface[]) => {
        this.programs = programs;
        console.log(this.programs);
      });
  }

  ngOnDestroy(): void {
    this.programsSubscription.unsubscribe();
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
// cancel ne radi svuda
// treba izmeniti objekte (program. mg, exer) - dodati nove propertije kao na promer sliku ili tako nesto a exercise ce imati sve propertije kao i exercise u gymAPiju
