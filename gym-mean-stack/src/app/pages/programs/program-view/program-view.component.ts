import { Component, OnInit } from '@angular/core';
import { RequestsService } from '../../../services/requests.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { MuscleGroupInterface } from '../../../models/muscle-group.model';

@Component({
  selector: 'app-program-view',
  standalone: true,
  imports: [NgFor, NgIf, CommonModule],
  templateUrl: './program-view.component.html',
  styleUrl: './program-view.component.scss',
})
export class ProgramViewComponent implements OnInit {
  constructor(
    private requestsService: RequestsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  tasks!: any;
  programId!: string;
  muscleGroups!: MuscleGroupInterface[];

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.programId = params?.['programId'];

      this.requestsService
        .getMuscleGroup(this.programId)
        .subscribe((mgList: MuscleGroupInterface[]) => {
          this.muscleGroups = mgList;
        });
    });
  }

  createNewMucleGroup() {
    this.router.navigate([`programs/${this.programId}/new-muscle-group`]);
  }
}
