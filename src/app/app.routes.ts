import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/auth/login/login.component';

// app.routes.ts
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  {
    path: 'dashboard-estudiante',
    component: DashboardEstudianteComponent,
    canActivate: [authGuard]
  },
  {
    path: 'dashboard-tutor',
    component: DashboardTutorComponent,
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    component: DashboardAdminComponent,
    canActivate: [authGuard]
  },

  { path: '**', redirectTo: 'login' }
];
