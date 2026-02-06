import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/auth/login/login.component';
import { FormTutoriaComponent } from './features/tutorias/registrar/form-tutoria.component';
import { AgendarTutoriaComponent } from './features/tutorias/agendar/agendar-tutoria.component';
import { HistorialComponent } from './features/tutorias/historial/historial.component';

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
  {
  path: 'registrar-tutoria',
  component: FormTutoriaComponent,
  canActivate: [authGuard]
  },
  {
  path: 'agendar-tutoria',
  component: AgendarTutoriaComponent,
  canActivate: [authGuard]
  },
  {
  path: 'historial',
  component: HistorialComponent,
  canActivate: [authGuard]
  },

  { path: '**', redirectTo: 'login' }
];
