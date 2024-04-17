import { Routes } from '@angular/router';
import { ProgramsPageComponent } from './pages/programs/programs-page/programs-page.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { LoginComponent } from './pages/auth/login/login.component';

export const routes: Routes = [
  { path: '', redirectTo: 'programs', pathMatch: 'full' },
  { path: 'programs', component: ProgramsPageComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
];
