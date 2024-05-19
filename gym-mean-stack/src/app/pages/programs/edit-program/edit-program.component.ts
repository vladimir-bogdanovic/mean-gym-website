import { Component, OnInit } from '@angular/core';
import { RequestsService } from '../../../services/requests.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-edit-program',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './edit-program.component.html',
  styleUrl: './edit-program.component.scss',
})
export class EditProgramComponent implements OnInit {
  constructor(
    private requestsService: RequestsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  programForm!: FormGroup;
  imageData!: string;
  programId!: string;

  ngOnInit(): void {
    this.programForm = new FormGroup({
      name: new FormControl(null),
      image: new FormControl(null),
    });

    this.route.params.subscribe((params: Params) => {
      this.programId = params?.['programId'];
    });
  }

  onSubmit() {
    this.requestsService.editProgram(
      this.programId,
      this.programForm.value.name,
      this.programForm.value.image
    );
    this.programForm.reset();
    this.imageData = null!;
  }
  onFileSelected(event: Event) {
    const allowedFileTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    const input = event.target as HTMLInputElement;
    if (input && input.files && input.files.length > 0) {
      const file = input.files[0];
      console.log(typeof file);
      console.log(file);
      if (file && allowedFileTypes.includes(file.type)) {
        const reader = new FileReader();
        reader.onload = () => {
          this.imageData = reader.result as string;
        };
        reader.readAsDataURL(file);
        // Assign file to image control in form
        this.programForm.patchValue({ image: file });
      } else {
        console.log('Invalid file type selected');
      }
    } else {
      console.log('No file selected');
    }
  }
}
