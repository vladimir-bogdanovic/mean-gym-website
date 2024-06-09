import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestsService } from '../../../services/requests.service';
import { ProgramInterface } from '../../../models/program.model';
import { NgFor, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-programs-page',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './programs-page.component.html',
  styleUrl: './programs-page.component.scss',
})
export class ProgramsPageComponent implements OnInit, OnDestroy {
  programs!: ProgramInterface[];
  private programsSubscription!: Subscription;

  constructor(
    private router: Router,
    private requestsService: RequestsService,
    private authService: AuthService,
    private route: ActivatedRoute
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

  addNewProgram() {
    this.router.navigate(['/new-program']);
  }

  goToSelectedProgram(programId: string | undefined) {
    this.router.navigate([`/programs/${programId}/mg-lists`]);
  }

  deleteProgramOnClikc(programId: string) {
    //  console.log(programId);
    this.requestsService.deleteProgram(programId);
    this.programsSubscription = this.requestsService
      .getProgramsStream()
      .subscribe((programs: ProgramInterface[]) => {
        this.programs = programs;
        console.log(this.programs);
      });
  }

  editProgramClick(programId: string | undefined) {
    this.router.navigate([`programs/${programId}`]);
  }

  ngOnDestroy(): void {
    if (this.programsSubscription) {
      this.programsSubscription.unsubscribe();
    }
  }
}
