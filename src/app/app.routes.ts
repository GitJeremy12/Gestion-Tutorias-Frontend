import { Routes } from '@angular/router';

/* HU-03: Autenticación */
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthGuard } from './auth/guards/auth.guard';

/* HU-01: Tutor */
import { RegistrarTutoriaComponent } from './tutorias/registrar-tutoria/registrar-tutoria.component';
import { TutorGuard } from './auth/guards/tutor.guard';

/* HU-02: Estudiante */
import { AgendarTutoriaComponent } from './tutorias/agendar-tutoria/agendar-tutoria.component';

/* HU-04: Estudiante */
import { HistorialTutoriasComponent } from './tutorias/historial-tutorias/historial-tutorias.component';

/* Dashboards */
import { DashboardTutorComponent } from './dashboards/dashboard-tutor.component';
import { DashboardEstudianteComponent } from './dashboards/dashboard-estudiante.component';
import { AdminComponent } from './dashboards/admin.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  /* Auth */
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  /* Dashboards */
  {
    path: 'dashboard-tutor',
    component: DashboardTutorComponent,
    canActivate: [AuthGuard, TutorGuard]
  },
  {
    path: 'dashboard-estudiante',
    component: DashboardEstudianteComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard] // luego puedes añadir AdminGuard
  },

  /* Tutorías */
  {
    path: 'registrar-tutoria',
    component: RegistrarTutoriaComponent,
    canActivate: [AuthGuard, TutorGuard]
  },
  {
    path: 'agendar-tutoria',
    component: AgendarTutoriaComponent,
    canActivate: [AuthGuard]
  },{
  path: 'historial',
  component: HistorialTutoriasComponent,
  canActivate: [AuthGuard]
},

  /* Fallback */
  { path: '**', redirectTo: 'login' }
];
