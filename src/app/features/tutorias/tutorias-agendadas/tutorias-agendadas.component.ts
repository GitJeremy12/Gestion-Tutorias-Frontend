import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportesService } from '../../../core/services/reportes.service';
import { Observable, of } from 'rxjs';
import { catchError, shareReplay, timeout } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'app-tutorias-agendadas',
  templateUrl: './tutorias-agendadas.component.html',
  imports: [CommonModule]
})
export class TutoriasAgendadasComponent {

  reporte$: Observable<any>;

  constructor(private reportesService: ReportesService) {
    // ✅ aquí ya existe reportesService
    this.reporte$ = this.reportesService.getReporteEstudiante(0).pipe(
      timeout(8000),
      shareReplay(1),
      catchError(err => {
        console.error('Error reporte estudiante:', err);
        return of(null);
      })
    );
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
