import { Routes } from '@angular/router';
import { ProgramsPageComponent } from './pages/programs/programs-page/programs-page.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { ProgramViewComponent } from './pages/programs/program-view/program-view.component';
import { NewProgramComponent } from './pages/programs/new-program/new-program.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'programs', component: ProgramsPageComponent },
  {
    path: 'programs/:programsId/program-view',
    component: ProgramViewComponent,
  },
  { path: 'new-program', component: NewProgramComponent },
];
