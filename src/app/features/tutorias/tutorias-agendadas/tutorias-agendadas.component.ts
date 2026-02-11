import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportesService } from '../../../core/services/reportes.service';
import { finalize, timeout } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'app-tutorias-agendadas',
  templateUrl: './tutorias-agendadas.component.html',
  imports: [CommonModule]
})
export class TutoriasAgendadasComponent implements OnInit {

  reporte: any = null;
  loading = false;

  constructor(private reportesService: ReportesService) {}

  ngOnInit(): void {
    this.cargarReporte();
  }

  cargarReporte(): void {
    this.loading = true;

    // 👇 OBLIGATORIO mandar 0 porque el backend lo espera
    this.reportesService.getReporteEstudiante(0)
      .pipe(
        timeout(8000),                 // ⏱️ evita loading infinito
        finalize(() => {
          this.loading = false;        // ✅ SIEMPRE se ejecuta
        })
      )
      .subscribe({
        next: (data) => {
          this.reporte = data;
          console.log('Reporte recibido:', data);
        },
        error: (err) => {
          console.error('Error reporte estudiante:', err);
        }
      });
  }

  descargarPDF(): void {
    this.reportesService.exportarPDF('estudiante')
      .subscribe(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'reporte-estudiante.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      });
  }
}
