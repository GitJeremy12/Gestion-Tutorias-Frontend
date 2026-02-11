import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import { ReportesService } from '../../../core/services/reportes.service';

@Component({
  standalone: true,
  selector: 'app-reporte-semanal',
  imports: [CommonModule, FormsModule],
  templateUrl: './reporte-semanal.component.html',
  styleUrls: ['./reporte-semanal.component.css']
})
export class ReporteSemanalComponent implements AfterViewInit, OnDestroy {
  semana = '';
  reporte: any = null;
  error = '';
  generando = false;
  exportando = false;
  reporteBuscado = false;
  mostrarGraficos = true;
  graficosGenerados = false;

  chartMaterias: Chart | null = null;
  chartTutores: Chart | null = null;

  constructor(private reportesService: ReportesService) {
    this.setCurrentWeek();
  }

  ngAfterViewInit() {
    // Los gráficos se generan después de obtener datos
  }

  ngOnDestroy() {
    // Limpiar gráficos al destruir componente
    this.chartMaterias?.destroy();
    this.chartTutores?.destroy();
  }

  // Establecer semana actual por defecto
  setCurrentWeek() {
    const now = new Date();
    const year = now.getFullYear();
    const week = this.getWeekNumber(now);
    this.semana = `${year}-W${String(week).padStart(2, '0')}`;
  }

  // Obtener número de semana
  getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  }

  // Obtener semana máxima (actual)
  getMaxWeek(): string {
    const now = new Date();
    const year = now.getFullYear();
    const week = this.getWeekNumber(now);
    return `${year}-W${String(week).padStart(2, '0')}`;
  }

  // Generar reporte
  generarReporte() {
    this.error = '';
    this.reporte = null;
    this.reporteBuscado = false;
    this.graficosGenerados = false;

    if (!this.semana) {
      this.error = 'Por favor selecciona una semana';
      return;
    }

    this.generando = true;

    this.reportesService.getReporteSemanal(this.semana).subscribe({
      next: data => {
        this.reporte = data;
        this.reporteBuscado = true;
        this.generando = false;

        // Generar gráficos automáticamente si hay datos
        if (this.reporte && this.mostrarGraficos) {
          setTimeout(() => {
            this.generarGraficos();
          }, 100);
        }
      },
      error: err => {
        this.error = err.error?.message || 'Error al generar el reporte. Intenta nuevamente.';
        this.generando = false;
        this.reporteBuscado = true;
        console.error('Error al generar reporte:', err);
      }
    });
  }

  // Generar gráficos
  generarGraficos() {
    if (!this.reporte) return;

    // Destruir gráficos previos
    if (this.chartMaterias) {
      this.chartMaterias.destroy();
      this.chartMaterias = null;
    }
    if (this.chartTutores) {
      this.chartTutores.destroy();
      this.chartTutores = null;
    }

    try {
      // Gráfico de materias (Barras)
      const canvasMaterias = document.getElementById('chartMaterias') as HTMLCanvasElement;
      if (canvasMaterias && this.reporte.materias && this.reporte.materias.length > 0) {
        const configMaterias: ChartConfiguration = {
          type: 'bar',
          data: {
            labels: this.reporte.materias.map((m: any) => m.nombre),
            datasets: [{
              label: 'Número de Tutorías',
              data: this.reporte.materias.map((m: any) => m.total),
              backgroundColor: [
                'rgba(102, 126, 234, 0.8)',
                'rgba(118, 75, 162, 0.8)',
                'rgba(52, 152, 219, 0.8)',
                'rgba(46, 204, 113, 0.8)',
                'rgba(241, 196, 15, 0.8)',
                'rgba(230, 126, 34, 0.8)',
                'rgba(231, 76, 60, 0.8)'
              ],
              borderColor: [
                'rgb(102, 126, 234)',
                'rgb(118, 75, 162)',
                'rgb(52, 152, 219)',
                'rgb(46, 204, 113)',
                'rgb(241, 196, 15)',
                'rgb(230, 126, 34)',
                'rgb(231, 76, 60)'
              ],
              borderWidth: 2,
              borderRadius: 8
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend: {
                display: false
              },
              title: {
                display: false
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1
                }
              }
            }
          }
        };

        this.chartMaterias = new Chart(canvasMaterias, configMaterias);
      }

      // Gráfico de tutores (Doughnut)
      const canvasTutores = document.getElementById('chartTutores') as HTMLCanvasElement;
      if (canvasTutores && this.reporte.tutores && this.reporte.tutores.length > 0) {
        const configTutores: ChartConfiguration = {
          type: 'doughnut',
          data: {
            labels: this.reporte.tutores.map((t: any) => t.nombre),
            datasets: [{
              label: 'Tutorías Impartidas',
              data: this.reporte.tutores.map((t: any) => t.total),
              backgroundColor: [
                'rgba(102, 126, 234, 0.8)',
                'rgba(118, 75, 162, 0.8)',
                'rgba(52, 152, 219, 0.8)',
                'rgba(46, 204, 113, 0.8)',
                'rgba(241, 196, 15, 0.8)',
                'rgba(230, 126, 34, 0.8)',
                'rgba(231, 76, 60, 0.8)'
              ],
              borderColor: '#ffffff',
              borderWidth: 2
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  padding: 15,
                  font: {
                    size: 12
                  }
                }
              }
            }
          }
        };

        this.chartTutores = new Chart(canvasTutores, configTutores);
      }

      this.graficosGenerados = true;
    } catch (error) {
      console.error('Error al generar gráficos:', error);
      this.error = 'Error al generar los gráficos';
    }
  }

  // Toggle mostrar/ocultar gráficos
  toggleGraficos() {
    this.graficosGenerados = !this.graficosGenerados;

    if (this.graficosGenerados && this.reporte) {
      setTimeout(() => {
        this.generarGraficos();
      }, 100);
    }
  }

  // Calcular porcentaje para barras de progreso
  getPercentage(valor: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((valor / total) * 100);
  }

  // Exportar a PDF
  exportarPDF() {
    if (!this.reporte) {
      alert('No hay reporte para exportar');
      return;
    }

    this.exportando = true;

    try {
      console.log('📄 Exportando a PDF...');
      console.log('Datos del reporte:', this.reporte);

      // Simulación temporal
      setTimeout(() => {
        alert('Funcionalidad de exportación PDF en desarrollo.\n\nDatos disponibles en consola para integración futura.');
        this.exportando = false;
      }, 1000);

      // TODO: Implementar con jsPDF cuando sea necesario
      /*
      import jsPDF from 'jspdf';
      import autoTable from 'jspdf-autotable';

      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text('Reporte Semanal de Tutorías', 14, 20);
      doc.setFontSize(12);
      doc.text(`Semana: ${this.semana}`, 14, 30);
      doc.text(`Total de tutorías: ${this.reporte.totalTutorias}`, 14, 40);

      // Tabla de materias
      autoTable(doc, {
        startY: 50,
        head: [['Materia', 'Total de Tutorías']],
        body: this.reporte.materias.map((m: any) => [m.nombre, m.total])
      });

      // Tabla de tutores
      autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 10,
        head: [['Tutor', 'Total de Tutorías']],
        body: this.reporte.tutores.map((t: any) => [t.nombre, t.total])
      });

      doc.save(`reporte-semanal-${this.semana}.pdf`);
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
    if (!this.reporte) {
      alert('No hay reporte para exportar');
      return;
    }

    this.exportando = true;

    try {
      console.log('📊 Exportando a Excel...');
      console.log('Datos del reporte:', this.reporte);

      // Simulación temporal
      setTimeout(() => {
        alert('Funcionalidad de exportación Excel en desarrollo.\n\nDatos disponibles en consola para integración futura.');
        this.exportando = false;
      }, 1000);

      // TODO: Implementar con XLSX cuando sea necesario
      /*
      import * as XLSX from 'xlsx';

      const workbook = XLSX.utils.book_new();

      // Hoja de resumen
      const resumenData = [
        ['Reporte Semanal de Tutorías'],
        ['Semana:', this.semana],
        ['Total de tutorías:', this.reporte.totalTutorias],
        [''],
        ['Materias Más Solicitadas'],
        ['Materia', 'Total']
      ];

      this.reporte.materias.forEach((m: any) => {
        resumenData.push([m.nombre, m.total]);
      });

      resumenData.push(['']);
      resumenData.push(['Tutores Más Activos']);
      resumenData.push(['Tutor', 'Total']);

      this.reporte.tutores.forEach((t: any) => {
        resumenData.push([t.nombre, t.total]);
      });

      const worksheet = XLSX.utils.aoa_to_sheet(resumenData);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte');

      XLSX.writeFile(workbook, `reporte-semanal-${this.semana}.xlsx`);
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
    if (!this.reporte) {
      alert('No hay reporte para exportar');
      return;
    }

    try {
      // Crear CSV
      let csv = 'Reporte Semanal de Tutorías\n';
      csv += `Semana: ${this.semana}\n`;
      csv += `Total de tutorías: ${this.reporte.totalTutorias}\n\n`;

      csv += 'Materias Más Solicitadas\n';
      csv += 'Materia,Total\n';
      this.reporte.materias.forEach((m: any) => {
        csv += `"${m.nombre}",${m.total}\n`;
      });

      csv += '\nTutores Más Activos\n';
      csv += 'Tutor,Total\n';
      this.reporte.tutores.forEach((t: any) => {
        csv += `"${t.nombre}",${t.total}\n`;
      });

      // Descargar
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute('download', `reporte-semanal-${this.semana}.csv`);
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
}
