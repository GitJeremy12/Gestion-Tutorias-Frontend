import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardService } from '../../../core/services/dashboard.service';


@Component({
  standalone: true,
  selector: 'app-dashboard-tutor',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-tutor.component.html',
  styleUrls: ['./dashboard-tutor.component.css']
})
export class DashboardTutorComponent implements OnInit {
  nombreUsuario = 'Tutor';
  especialidad = '';

  // Estadísticas
  tutoriasImpartidas = 0;
  estudiantesAtendidos = 0;
  tutoriasHoy = 0;
  horasImpartidas = 0;

  // Agenda del día
  agendaHoy: any[] = [];

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
      this.nombreUsuario = usuario.nombre || 'Tutor';
      this.especialidad = usuario.especialidad || '';
    }

    // Cargar estadísticas del tutor
    this.dashboardService.getEstadisticasTutor().subscribe({
      next: (data: { totalTutorias: number; estudiantesAtendidos: number; tutoriasHoy: number; horasImpartidas: number; }) => {
        this.tutoriasImpartidas = data.totalTutorias || 0;
        this.estudiantesAtendidos = data.estudiantesAtendidos || 0;
        this.tutoriasHoy = data.tutoriasHoy || 0;
        this.horasImpartidas = data.horasImpartidas || 0;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error al cargar estadísticas:', err);
        this.loading = false;
      }
    });

    // Cargar agenda del día
    this.dashboardService.getAgendaHoy().subscribe({
      next: (data: any[]) => {
        this.agendaHoy = data;
      },
      error: (err: any) => {
        console.error('Error al cargar agenda:', err);
      }
    });
  }

  refrescar() {
    this.cargarDashboard();
  }
}
