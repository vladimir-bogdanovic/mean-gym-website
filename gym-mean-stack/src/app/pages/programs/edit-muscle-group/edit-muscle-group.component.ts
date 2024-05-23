import { Component, OnInit } from '@angular/core';
import { RequestsService } from '../../../services/requests.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-edit-muscle-group',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './edit-muscle-group.component.html',
  styleUrl: './edit-muscle-group.component.scss',
})
export class EditMuscleGroupComponent implements OnInit {
  inputValue!: string;
  programId!: string;
  mgId!: string;

  muscleGroupFrom!: FormGroup;

  constructor(
    private requestsService: RequestsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.programId = params?.['programId'];
      this.mgId = params?.['mgListId'];
    });

    this.muscleGroupFrom = new FormGroup({
      newMuscleName: new FormControl(null),
    });
  }

  onSubmit() {
    this.requestsService.editMuscleGroup(
      this.programId,
      this.mgId,
      this.muscleGroupFrom.value.newMuscleName
    );
    this.router.navigate([
      `programs/${this.programId}/mg-lists/${this.mgId}/exercises`,
    ]);
  }

  cancelButton() {
    this.router.navigate([
      `programs/${this.programId}/mg-lists/${this.mgId}/exercises`,
    ]);
  }
}
