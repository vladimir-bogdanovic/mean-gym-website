import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RequestsService } from '../../../services/requests.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MuscleGroupInterface } from '../../../models/muscle-group.model';

@Component({
  selector: 'app-new-muscle-group',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './new-muscle-group.component.html',
  styleUrl: './new-muscle-group.component.scss',
})
export class NewMuscleGroupComponent {
  inputValue!: string;
  programId!: string;

  constructor(
    private requestsService: RequestsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  createNewMuscle() {
    this.route.params.subscribe((param: Params) => {
      this.programId = param?.['programId'];
    });

    this.requestsService
      .createMuscleGroup(this.programId, this.inputValue)
      .subscribe((muscleGroup: MuscleGroupInterface) => {
        console.log(muscleGroup);
        this.router.navigate([`programs/${this.programId}/mg-lists`]);
      });
  }
}
