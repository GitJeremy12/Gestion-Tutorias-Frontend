import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportesService } from '../../../core/services/reportes.service';

@Component({
  standalone: true,
  selector: 'app-reporte-estudiante',
  imports: [CommonModule, FormsModule],
  templateUrl: './reporte-estudiante.component.html',
  styleUrls: ['./reporte-estudiante.component.css']
})
export class ReporteEstudianteComponent implements OnInit {
limpiarFiltros() {
throw new Error('Method not implemented.');
}
getMaxDate() {
throw new Error('Method not implemented.');
}
estudianteSeleccionado: any;
esError: any;
generando: any;
getTutoresUnicos() {
throw new Error('Method not implemented.');
}
getHorasTotales() {
throw new Error('Method not implemented.');
}
getMateriasUnicas() {
throw new Error('Method not implemented.');
}
exportando: any;
exportarCSV() {
throw new Error('Method not implemented.');
}

  estudiantes: any[] = [];
  tutorias: any[] = [];

  estudianteId = '';
  desde = '';
  hasta = '';

  mensaje = '';
reporteGenerado: any;

  constructor(private reportesService: ReportesService) {}

  ngOnInit() {
    this.cargarEstudiantes();
  }

  cargarEstudiantes() {
    this.reportesService.getEstudiantes().subscribe({
      next: data => this.estudiantes = data
    });
  }

  generar() {
    this.mensaje = '';
    this.tutorias = [];

    if (!this.estudianteId) {
      this.mensaje = 'Seleccione un estudiante';
      return;
    }

    this.reportesService
      .generarReporte(+this.estudianteId, this.desde, this.hasta)
      .subscribe({
        next: data => {
          this.tutorias = data;
          if (!data.length) {
            this.mensaje = 'No hay tutorías en este período';
          }
        },
        error: () => {
          this.mensaje = 'Error al generar reporte';
        }
      });
  }
  exportarPDF() {
  this.reportesService.exportToPDF(
    'Reporte de Tutorías por Estudiante',
    ['fecha', 'materia', 'tutor', 'observaciones'],
    this.reporte,
    'reporte-estudiante'
  );
}

exportarExcel() {
  this.reportesService.exportToExcel(
    this.reporte,
    'reporte-estudiante'
  );
}
  reporte(reporte: any, arg1: string) {
    throw new Error('Method not implemented.');
  }
}
