import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { RequestsService } from '../../../services/requests.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-new-muscle-group',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './new-muscle-group.component.html',
  styleUrl: './new-muscle-group.component.scss',
})
export class NewMuscleGroupComponent implements OnInit {
  programId!: string;
  mgId!: string | undefined;
  muscleGroupForm!: FormGroup;

  constructor(
    private requestsService: RequestsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((param: Params) => {
      this.programId = param?.['programId'];
    });

    this.muscleGroupForm = new FormGroup({
      muscleName: new FormControl(null),
    });
  }

  onSubmit() {
    this.requestsService.createMuscleGroup(
      this.programId,
      this.muscleGroupForm.value.muscleName
    );
    this.router.navigate([`programs/${this.programId}/mg-lists`]);
  }

  cancelClick() {
    this.router.navigate([`programs/${this.programId}/mg-lists`]);
  }
}
