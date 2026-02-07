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
  estudiantes: any[] = [];
  tutorias: any[] = [];
  estudianteSeleccionado: any = null;

  estudianteId = '';
  desde = '';
  hasta = '';

  mensaje = '';
  esError = false;
  generando = false;
  exportando = false;
  reporteGenerado = false;

  constructor(private reportesService: ReportesService) {}

  ngOnInit() {
    this.cargarEstudiantes();
  }

  cargarEstudiantes() {
    this.reportesService.getEstudiantes().subscribe({
      next: data => {
        this.estudiantes = data;
      },
      error: err => {
        this.mensaje = 'Error al cargar la lista de estudiantes';
        this.esError = true;
        console.error('Error al cargar estudiantes:', err);
      }
    });
  }

  // Obtener fecha máxima (hoy)
  getMaxDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  // Limpiar filtros
  limpiarFiltros() {
    this.estudianteId = '';
    this.desde = '';
    this.hasta = '';
    this.tutorias = [];
    this.estudianteSeleccionado = null;
    this.mensaje = '';
    this.esError = false;
    this.reporteGenerado = false;
  }

  // Generar reporte
  generar() {
    this.mensaje = '';
    this.esError = false;
    this.tutorias = [];
    this.reporteGenerado = false;

    // Validación
    if (!this.estudianteId) {
      this.mensaje = 'Por favor selecciona un estudiante';
      this.esError = true;
      return;
    }

    // Validar fechas
    if (this.desde && this.hasta) {
      const fechaDesde = new Date(this.desde);
      const fechaHasta = new Date(this.hasta);

      if (fechaDesde > fechaHasta) {
        this.mensaje = 'La fecha "Desde" no puede ser mayor que la fecha "Hasta"';
        this.esError = true;
        return;
      }
    }

    // Obtener estudiante seleccionado
    this.estudianteSeleccionado = this.estudiantes.find(
      e => e.id === +this.estudianteId
    ) || null;

    this.generando = true;

    this.reportesService
      .generarReporte(+this.estudianteId, this.desde, this.hasta)
      .subscribe({
        next: data => {
          this.tutorias = data;
          this.reporteGenerado = true;
          this.generando = false;

          if (!data.length) {
            this.mensaje = 'No se encontraron tutorías para los filtros seleccionados';
            this.esError = false;
          } else {
            this.mensaje = `Se encontraron ${data.length} tutoría${data.length > 1 ? 's' : ''}`;
            this.esError = false;
          }
        },
        error: err => {
          this.mensaje = err.error?.message || 'Error al generar el reporte. Intenta nuevamente.';
          this.esError = true;
          this.generando = false;
          this.reporteGenerado = true;
          console.error('Error al generar reporte:', err);
        }
      });
  }

  // Obtener materias únicas
  getMateriasUnicas(): number {
    const materias = new Set(this.tutorias.map(t => t.materia));
    return materias.size;
  }

  // Obtener tutores únicos
  getTutoresUnicos(): number {
    const tutores = new Set(this.tutorias.map(t => t.tutor?.nombre).filter(Boolean));
    return tutores.size;
  }

  // Obtener horas totales
  getHorasTotales(): number {
    const totalMinutos = this.tutorias.reduce((total, t) => {
      return total + (t.duracion || 60);
    }, 0);
    return Math.round((totalMinutos / 60) * 10) / 10; // Redondear a 1 decimal
  }

  // Exportar a PDF
  exportarPDF() {
    if (!this.tutorias.length) {
      alert('No hay datos para exportar');
      return;
    }

    this.exportando = true;

    try {
      console.log('📄 Exportando a PDF...');
      console.log('Datos:', {
        estudiante: this.estudianteSeleccionado,
        tutorias: this.tutorias,
        desde: this.desde,
        hasta: this.hasta
      });

      // Simulación temporal
      setTimeout(() => {
        alert('Funcionalidad de exportación PDF en desarrollo.\n\nDatos disponibles en consola.');
        this.exportando = false;
      }, 1000);

      // TODO: Implementar con jsPDF
      /*
      import jsPDF from 'jspdf';
      import autoTable from 'jspdf-autotable';

      const doc = new jsPDF();

      // Título
      doc.setFontSize(18);
      doc.text('Reporte de Tutorías por Estudiante', 14, 20);

      // Información del estudiante
      doc.setFontSize(12);
      doc.text(`Estudiante: ${this.estudianteSeleccionado.nombre}`, 14, 30);
      if (this.estudianteSeleccionado.matricula) {
        doc.text(`Matrícula: ${this.estudianteSeleccionado.matricula}`, 14, 37);
      }
      if (this.desde && this.hasta) {
        doc.text(`Período: ${this.desde} a ${this.hasta}`, 14, 44);
      }

      // Estadísticas
      doc.text(`Total de tutorías: ${this.tutorias.length}`, 14, 54);
      doc.text(`Horas totales: ${this.getHorasTotales()}h`, 14, 61);

      // Tabla
      autoTable(doc, {
        startY: 70,
        head: [['Fecha', 'Materia', 'Tema', 'Tutor', 'Duración', 'Observaciones']],
        body: this.tutorias.map(t => [
          new Date(t.fechaHora).toLocaleDateString('es-ES'),
          t.materia,
          t.tema || '-',
          t.tutor?.nombre || 'N/A',
          `${t.duracion || 60} min`,
          t.observaciones || '-'
        ]),
        styles: { fontSize: 9 },
        headStyles: { fillColor: [102, 126, 234] }
      });

      doc.save(`reporte-estudiante-${this.estudianteId}-${new Date().getTime()}.pdf`);
      this.exportando = false;
      */
    } catch (error) {
      console.error('Error al exportar PDF:', error);
      alert('Error al exportar PDF');
      this.exportando = false;
    }
  }

  // Exportar a Excel
  exportarExcel() {
    if (!this.tutorias.length) {
      alert('No hay datos para exportar');
      return;
    }

    this.exportando = true;

    try {
      console.log('📊 Exportando a Excel...');
      console.log('Datos:', this.tutorias);

      // Simulación temporal
      setTimeout(() => {
        alert('Funcionalidad de exportación Excel en desarrollo.\n\nDatos disponibles en consola.');
        this.exportando = false;
      }, 1000);

      // TODO: Implementar con XLSX
      /*
      import * as XLSX from 'xlsx';

      const data = this.tutorias.map(t => ({
        'Fecha': new Date(t.fechaHora).toLocaleDateString('es-ES'),
        'Hora': new Date(t.fechaHora).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        'Materia': t.materia,
        'Tema': t.tema || '-',
        'Tutor': t.tutor?.nombre || 'N/A',
        'Duración (min)': t.duracion || 60,
        'Observaciones': t.observaciones || '-'
      }));

      const worksheet = XLSX.utils.json_to_sheet(data);

      // Ajustar anchos de columna
      const colWidths = [
        { wch: 12 }, // Fecha
        { wch: 8 },  // Hora
        { wch: 20 }, // Materia
        { wch: 25 }, // Tema
        { wch: 20 }, // Tutor
        { wch: 12 }, // Duración
        { wch: 30 }  // Observaciones
      ];
      worksheet['!cols'] = colWidths;

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte');

      XLSX.writeFile(workbook, `reporte-estudiante-${this.estudianteId}-${new Date().getTime()}.xlsx`);
      this.exportando = false;
      */
    } catch (error) {
      console.error('Error al exportar Excel:', error);
      alert('Error al exportar Excel');
      this.exportando = false;
    }
  }

  // Exportar a CSV
  exportarCSV() {
    if (!this.tutorias.length) {
      alert('No hay datos para exportar');
      return;
    }

    try {
      // Crear CSV
      let csv = 'Reporte de Tutorías por Estudiante\n';
      csv += `Estudiante: ${this.estudianteSeleccionado.nombre}\n`;

      if (this.estudianteSeleccionado.matricula) {
        csv += `Matrícula: ${this.estudianteSeleccionado.matricula}\n`;
      }

      if (this.desde && this.hasta) {
        csv += `Período: ${this.desde} a ${this.hasta}\n`;
      }

      csv += `Total de tutorías: ${this.tutorias.length}\n`;
      csv += `Horas totales: ${this.getHorasTotales()}h\n\n`;

      csv += 'Fecha,Hora,Materia,Tema,Tutor,Duración (min),Observaciones\n';

      this.tutorias.forEach(t => {
        const fecha = new Date(t.fechaHora).toLocaleDateString('es-ES');
        const hora = new Date(t.fechaHora).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        const materia = t.materia || '';
        const tema = t.tema || '-';
        const tutor = t.tutor?.nombre || 'N/A';
        const duracion = t.duracion || 60;
        const observaciones = t.observaciones || '-';

        csv += `"${fecha}","${hora}","${materia}","${tema}","${tutor}",${duracion},"${observaciones}"\n`;
      });

      // Descargar
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute('download', `reporte-estudiante-${this.estudianteId}-${new Date().getTime()}.csv`);
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al exportar CSV:', error);
      alert('Error al exportar CSV');
    }
  }

  // Método helper para formato de fecha (si lo necesitas en el template)
  formatDate(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Método helper para formato de hora
  formatTime(fecha: string): string {
    return new Date(fecha).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
