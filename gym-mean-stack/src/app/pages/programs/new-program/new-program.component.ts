import { Component, OnInit } from '@angular/core';
import { RequestsService } from '../../../services/requests.service';
import { Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { NgIf } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-new-program',
  standalone: true,
  imports: [FormsModule, NgIf, ReactiveFormsModule],
  templateUrl: './new-program.component.html',
  styleUrl: './new-program.component.scss',
})
export class NewProgramComponent implements OnInit {
  constructor(
    private requestsService: RequestsService,
    private authService: AuthService,
    private router: Router
  ) {}

  programForm!: FormGroup;
  imageData!: string;

  ngOnInit(): void {
    this.programForm = new FormGroup({
      name: new FormControl(null),
      image: new FormControl(null),
    });
  }

  onSubmit() {
    this.requestsService.createProgram(
      this.programForm.value.name,
      this.programForm.value.image
    );
    this.programForm.reset();
    this.imageData = null!;

    this.router.navigate(['/programs']);
  }
  onFileSelected(event: Event) {
    const allowedFileTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    const input = event.target as HTMLInputElement;
    if (input && input.files && input.files.length > 0) {
      const file = input.files[0];

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

  goBackToPrograms() {
    this.router.navigate(['programs']);
  }
}
