import { Component, OnInit } from '@angular/core';
import { RequestsService } from '../../../services/requests.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-muscle-group',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-muscle-group.component.html',
  styleUrl: './edit-muscle-group.component.scss',
})
export class EditMuscleGroupComponent implements OnInit {
  inputValue!: string;
  programId!: string;
  mgId!: string;

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
  }

  editMuscleGroup() {
    this.requestsService
      .editMuscleGroup(this.programId, this.mgId, this.inputValue)
      .subscribe(() => {
        this.router.navigate([
          `programs/${this.programId}/mg-lists/${this.mgId}/exercises`,
        ]);
      });
  }

  cancelButton() {
    this.router.navigate([
      `programs/${this.programId}/mg-lists/${this.mgId}/exercises`,
    ]);
  }
}
