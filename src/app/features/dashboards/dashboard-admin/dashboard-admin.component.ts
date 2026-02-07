import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardService } from '../../../core/services/dashboard.service';


@Component({
  standalone: true,
  selector: 'app-dashboard-admin',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent implements OnInit {
  nombreUsuario = 'Administrador';

  // Estadísticas
  totalTutorias = 0;
  totalEstudiantes = 0;
  totalTutores = 0;
  tutoriasHoy = 0;

  // Actividad reciente
  actividadReciente: any[] = [];

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
      this.nombreUsuario = usuario.nombre || 'Administrador';
    }

    // Cargar estadísticas
    this.dashboardService.getEstadisticasAdmin().subscribe({
      next: (data: { totalTutorias: number; totalEstudiantes: number; totalTutores: number; tutoriasHoy: number; }) => {
        this.totalTutorias = data.totalTutorias || 0;
        this.totalEstudiantes = data.totalEstudiantes || 0;
        this.totalTutores = data.totalTutores || 0;
        this.tutoriasHoy = data.tutoriasHoy || 0;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error al cargar estadísticas:', err);
        this.loading = false;
      }
    });

    // Cargar actividad reciente
    this.dashboardService.getActividadReciente().subscribe({
      next: (data: any[]) => {
        this.actividadReciente = data;
      },
      error: (err: any) => {
        console.error('Error al cargar actividad:', err);
      }
    });
  }

  refrescar() {
    this.cargarDashboard();
  }
}
