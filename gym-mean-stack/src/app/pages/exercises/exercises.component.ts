import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { ExercisesService } from '../../services/exercises.service';
import { GymApiExerciseInterface } from '../../models/gym-api-exercise.model';
import { NgClass, NgFor, NgIf, SlicePipe } from '@angular/common';
import { ShortenLinkPipe } from '../../pipes/shorten-link.pipe';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, debounceTime } from 'rxjs';
import { DropdownSubmenuComponent } from './dropdown-submenu/dropdown-submenu/dropdown-submenu.component';

@Component({
  selector: 'app-exercises',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    ShortenLinkPipe,
    SlicePipe,
    ReactiveFormsModule,
    NgClass,
    DropdownSubmenuComponent,
  ],
  templateUrl: './exercises.component.html',
  styleUrl: './exercises.component.scss',
})
export class ExercisesComponent implements OnInit {
  exercises!: GymApiExerciseInterface[];
  exerciseSubject: BehaviorSubject<GymApiExerciseInterface[]> =
    new BehaviorSubject<GymApiExerciseInterface[]>([]);

  currentPage = 1;
  itemsPerPage = 20;
  totalPageCount!: number;

  searchForm!: FormGroup;
  isFilterMenuOpen: boolean = false;
  isFilterSubmenuOpen: boolean = false;
  divElement!: HTMLElement;
  muscleGroups: string[] = [];
  muscleGroupsUnique: string[] = [];
  intensityLvl: string[] = [];
  intensityLvlUnique: string[] = [];
  equipment: string[] = [];
  EquipmentUnique: string[] = [];

  constructor(
    private exerciseService: ExercisesService,
    private fb: FormBuilder,
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.exerciseService
      .getFitnessData()
      .subscribe((resData: GymApiExerciseInterface[]) => {
        // by default all exercises
        this.exercises = resData;
        this.exerciseSubject.next(this.exercises);
        // console.log(this.exerciseSubject, this.exercises);

        this.exerciseSubject.subscribe((resDataSubject) => {
          console.log(resDataSubject);
          resData.filter((exercises: GymApiExerciseInterface) => {
            this.muscleGroups.push(exercises.Muscles);
            this.intensityLvl.push(exercises.Intensity_Level);
            this.equipment.push(exercises.Equipment);
            this.muscleGroupsUnique = this.makeUniqueArray(this.muscleGroups);
            this.intensityLvlUnique = this.makeUniqueArray(this.intensityLvl);
            this.EquipmentUnique = this.makeUniqueArray(this.equipment);

            this.totalPageCount = Math.ceil(resDataSubject.length / 20);
            // exercises by search input
            if (this.searchForm.value === '') {
              this.exercises = resDataSubject;
            } else {
              this.serachInput(resDataSubject);
            }
          });
        });
      });

    this.searchForm = this.fb.group({
      searchParameters: [''],
    });

    // click outside start
    this.divElement =
      this.elementRef.nativeElement.querySelector('.filter-container');
    this.renderer.listen(
      'document',
      'click',
      this.handleDocumentClick.bind(this)
    );
    // click outside end
  }

  // unique array method
  makeUniqueArray(arrayToFilter: string[]) {
    return [...new Set(arrayToFilter)];
  }

  // FILTER FUNCINALITY START

  renderFilteredData(dataFromChild: GymApiExerciseInterface[]) {
    //console.log(dataFromChild);
    this.exercises = dataFromChild;
    this.exerciseSubject.next(this.exercises);
    // console.log(this.exerciseSubject);
    //console.log(this.exercises);
  }

  handleDocumentClick(event: MouseEvent) {
    if (!this.divElement.contains(event.target as Node)) {
      // Click occurred outside the div, close it or perform other actions
      this.isFilterMenuOpen = false;
    }
  }

  toggleFilterMenu() {
    this.isFilterMenuOpen = !this.isFilterMenuOpen;
  }

  closeFilterMenu() {
    if (this.isFilterMenuOpen) {
      this.isFilterMenuOpen = false;
    }
  }

  // FILTER FUNCINALITY END

  onPageChange(pageNumber: number) {
    this.currentPage = pageNumber;
  }

  serachInput(data: GymApiExerciseInterface[]) {
    this.searchForm
      .get('searchParameters')
      ?.valueChanges.pipe(debounceTime(1000))
      .subscribe((value: string) => {
        this.exercises = data.filter((data: GymApiExerciseInterface) => {
          const lowerCaseData = data.WorkOut.toLowerCase();
          const lowerCaseValue = value.toLowerCase();
          console.log(data);
          return lowerCaseData.includes(lowerCaseValue);
        });
        this.totalPageCount = Math.ceil(this.exercises.length / 20);
      });
  }
}
