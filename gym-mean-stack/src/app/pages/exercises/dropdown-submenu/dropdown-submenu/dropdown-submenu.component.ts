import { NgClass, NgFor } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ExercisesService } from '../../../../services/exercises.service';
import { GymApiExerciseInterface } from '../../../../models/gym-api-exercise.model';

@Component({
  selector: 'app-dropdown-submenu',
  standalone: true,
  imports: [NgFor, NgClass],
  templateUrl: './dropdown-submenu.component.html',
  styleUrl: './dropdown-submenu.component.scss',
})
export class DropdownSubmenuComponent implements OnInit {
  @Input() title!: string;
  @Input() submenuOption!: string[];
  isFilterSubmenuOpen: boolean = false;

  constructor(private exerciseServise: ExercisesService) {}

  getSelectedItem(
    selectedOption: string,
    keysToTry: string[] = ['Muscles', 'Equipment', 'Intensity_Level']
  ) {
    const currentKey = keysToTry.shift(); // Get and remove the first key to try
    if (!currentKey) {
      console.error('No more keys to try'); // All keys have been tried
      return;
    }

    this.exerciseServise
      .getDataForFilter(currentKey, selectedOption)
      .subscribe((resData: GymApiExerciseInterface[]) => {
        if (resData.length === 0) {
          // If response data is empty, try the next key
          this.getSelectedItem(selectedOption, keysToTry);
        } else {
          // Data found, do something with it
          console.log('Data found:', resData);
        }
      });
  }

  ngOnInit(): void {
    console.log(this.submenuOption);
  }

  onMuscleGroupEnter() {
    this.isFilterSubmenuOpen = true;
  }

  onMuscleGroupLeave() {
    this.isFilterSubmenuOpen = false;
  }
}
