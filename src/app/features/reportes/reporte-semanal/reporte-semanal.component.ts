import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart } from 'chart.js/auto';
import { ReportesService } from '../../../core/services/reportes.service';

@Component({
  standalone: true,
  selector: 'app-reporte-semanal',
  imports: [CommonModule, FormsModule],
  templateUrl: './reporte-semanal.component.html',
  styleUrls: ['./reporte-semanal.component.css']
})
export class ReporteSemanalComponent implements AfterViewInit {

  semana = ''; // formato: 2026-W05
  reporte: any = null;
  error = '';

  chartMaterias: any;
  chartTutores: any;

  constructor(private reportesService: ReportesService) {}

  ngAfterViewInit() {}

  generarReporte() {
    this.error = '';
    this.reporte = null;

    if (!this.semana) {
      this.error = 'Seleccione una semana';
      return;
    }

    this.reportesService.getReporteSemanal(this.semana).subscribe({
      next: data => {
        this.reporte = data;
        setTimeout(() => this.generarGraficos(), 0);
      },
      error: err => {
        this.error = err.error?.message || 'Error al generar reporte';
      }
    });
  }

  generarGraficos() {
    // destruir gráficos previos
    this.chartMaterias?.destroy();
    this.chartTutores?.destroy();

    this.chartMaterias = new Chart('chartMaterias', {
      type: 'bar',
      data: {
        labels: this.reporte.materias.map((m: any) => m.nombre),
        datasets: [{
          label: 'Tutorías por materia',
          data: this.reporte.materias.map((m: any) => m.total)
        }]
      }
    });

    this.chartTutores = new Chart('chartTutores', {
      type: 'pie',
      data: {
        labels: this.reporte.tutores.map((t: any) => t.nombre),
        datasets: [{
          label: 'Tutorías por tutor',
          data: this.reporte.tutores.map((t: any) => t.total)
        }]
      }
    });
  }
}
