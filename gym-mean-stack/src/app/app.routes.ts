import { Routes } from '@angular/router';
import { ProgramsPageComponent } from './pages/programs/programs-page/programs-page.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { ProgramViewComponent } from './pages/programs/program-view/program-view.component';
import { NewProgramComponent } from './pages/programs/new-program/new-program.component';
import { NewMuscleGroupComponent } from './pages/programs/new-muscle-group/new-muscle-group.component';
import { NewExerciseComponent } from './pages/programs/new-exercise/new-exercise.component';
import { EditProgramComponent } from './pages/programs/edit-program/edit-program.component';
import { EditMuscleGroupComponent } from './pages/programs/edit-muscle-group/edit-muscle-group.component';
import { EditExerciseComponent } from './pages/programs/edit-exercise/edit-exercise.component';
import { ExercisesComponent } from './pages/exercises/exercises.component';
import { DropdownSubmenuComponent } from './pages/exercises/dropdown-submenu/dropdown-submenu/dropdown-submenu.component';
import { HomeComponent } from './pages/home/home/home.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  ///////// programs
  { path: 'programs', component: ProgramsPageComponent },
  {
    path: 'programs/:programId/mg-lists',
    component: ProgramViewComponent,
  },
  {
    path: 'new-program',
    component: NewProgramComponent,
  },
  {
    path: 'programs/:programId/new-muscle-group',
    component: NewMuscleGroupComponent,
  },
  {
    path: 'programs/:programId/mg-lists/:mgListId/exercises',
    component: ProgramViewComponent,
  },
  {
    path: 'programs/:programId/mg-lists/:mgListId/exercises/:exerciseId',
    component: ProgramViewComponent,
  },
  {
    path: 'programs/:programId/mg-lists/:mgListId/new-exercise',
    component: NewExerciseComponent,
  },
  {
    path: 'programs/:programId',
    component: EditProgramComponent,
  },
  {
    path: 'programs/:programId/mg-lists/:mgListId/edit-muscle-group',
    component: EditMuscleGroupComponent,
  },
  {
    path: 'programs/:programId/mg-lists/:mgListId/exercises/:exerciseId/edit-exercise',
    component: EditExerciseComponent,
  },
  ///////// exercises
  {
    path: 'exercises',
    component: ExercisesComponent,
  },
  { path: 'test', component: DropdownSubmenuComponent },
  ///////// home
  { path: 'home', component: HomeComponent },
];

// dodati ** rutu
// na kraju odraditi guard na neke rute
