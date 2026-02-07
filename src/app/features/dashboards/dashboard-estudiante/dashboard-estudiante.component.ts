import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardService } from '../../../core/services/dashboard.service';


@Component({
  standalone: true,
  selector: 'app-dashboard-estudiante',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-estudiante.component.html',
  styleUrls: ['./dashboard-estudiante.component.css']
})
export class DashboardEstudianteComponent implements OnInit {
  nombreUsuario = 'Estudiante';
  carrera = '';

  // Estadísticas
  misTutorias = 0;
  tutoriasCompletadas = 0;
  tutoriasAgendadas = 0;
  horasTotales = 0;

  // Próximas tutorías
  proximasTutorias: any[] = [];

  loading = false;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.cargarDashboard();
  }

  cargarDashboard() {
    this.loading = true;

    // Cargar datos del usuario
    const usuario = this.dashboardService.getUsuarioActual();
    if (usuario) {
      this.nombreUsuario = usuario.nombre || 'Estudiante';
      this.carrera = usuario.carrera || '';
    }

    // Cargar estadísticas del estudiante
    this.dashboardService.getEstadisticasEstudiante().subscribe({
      next: (data: { totalTutorias: number; completadas: number; agendadas: number; horasTotales: number; }) => {
        this.misTutorias = data.totalTutorias || 0;
        this.tutoriasCompletadas = data.completadas || 0;
        this.tutoriasAgendadas = data.agendadas || 0;
        this.horasTotales = data.horasTotales || 0;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error al cargar estadísticas:', err);
        this.loading = false;
      }
    });

    // Cargar próximas tutorías
    this.dashboardService.getProximasTutorias().subscribe({
      next: (data: any[]) => {
        this.proximasTutorias = data.slice(0, 3); // Solo las 3 más próximas
      },
      error: (err: any) => {
        console.error('Error al cargar próximas tutorías:', err);
      }
    });
  }

  refrescar() {
    this.cargarDashboard();
  }
}
