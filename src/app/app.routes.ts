// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { LoginComponent } from './features/auth/login/login.component';
import { FormTutoriaComponent } from './features/tutorias/registrar/form-tutoria.component';
import { AgendarTutoriaComponent } from './features/tutorias/agendar/agendar-tutoria.component';
import { HistorialComponent } from './features/tutorias/historial/historial.component';
import { ReporteEstudianteComponent } from './features/reportes/por-estudiante/reporte-estudiante.component';
import { DashboardAdminComponent } from './features/dashboards/dashboard-admin/dashboard-admin.component';
import { DashboardTutorComponent } from './features/dashboards/dashboard-tutor/dashboard-tutor.component';
import { DashboardEstudianteComponent } from './features/dashboards/dashboard-estudiante/dashboard-estudiante.component';
import { RegisterComponent } from './features/auth/register/register.component';

export const routes: Routes = [
  // Rutas públicas
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Dashboards protegidos por ROL
  {
    path: 'admin',
    component: DashboardAdminComponent,
    canActivate: [authGuard, roleGuard(['admin'])]
  },
  {
    path: 'dashboard-tutor',
    component: DashboardTutorComponent,
    canActivate: [authGuard, roleGuard(['tutor', 'admin'])]
  },
  {
    path: 'dashboard-estudiante',
    component: DashboardEstudianteComponent,
    canActivate: [authGuard, roleGuard(['estudiante', 'admin'])]
  },

  // Tutorías - solo tutor y admin
  {
    path: 'registrar-tutoria',
    component: FormTutoriaComponent,
    canActivate: [authGuard, roleGuard(['tutor', 'admin'])]
  },
  {
    path: 'tutorias/editar/:id',
    loadComponent: () =>
      import('./features/tutorias/editar-tutoria/editar-tutoria.component')
        .then(m => m.EditarTutoriaComponent),
    canActivate: [authGuard, roleGuard(['tutor', 'admin'])]
  },

  // Agendar - solo estudiantes
  {
    path: 'agendar-tutoria',
    component: AgendarTutoriaComponent,
    canActivate: [authGuard, roleGuard(['estudiante', 'admin'])]
  },

  // Historial - todos los roles autenticados
  {
    path: 'historial',
    component: HistorialComponent,
    canActivate: [authGuard]
  },

  // Reportes - solo admin
  {
    path: 'reporte-estudiante',
    component: ReporteEstudianteComponent,
    canActivate: [authGuard, roleGuard(['admin'])]
  },

  // Ruta raíz redirige según autenticación
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // 404
  { path: '**', redirectTo: 'login' }
];
