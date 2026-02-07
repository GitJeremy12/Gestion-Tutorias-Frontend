// historial.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HistorialService } from '../../../core/services/historial.service';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent implements OnInit {
  // Datos
  tutorias: any[] = [];
  tutoriasFiltradas: any[] = [];
  seleccionada: any = null;

  // Estado
  loading = false;
  error = '';

  // Filtros
  materiaFiltro = '';
  materias: string[] = [];

  constructor(
    private historialService: HistorialService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarHistorial();
  }

  /**
   * Cargar todas las tutorías del historial
   */
  cargarHistorial() {
    this.loading = true;
    this.error = '';

    this.historialService.getHistorial().subscribe({
      next: (tutorias) => {
        console.log('✅ Tutorías cargadas:', tutorias);
        this.tutorias = tutorias;
        this.tutoriasFiltradas = tutorias;
        this.extraerMaterias();
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error al cargar historial:', err);
        this.error = err.error?.message || 'Error al cargar el historial';
        this.loading = false;
      }
    });
  }

  /**
   * Extraer lista única de materias
   */
  extraerMaterias() {
    const materiasSet = new Set<string>();
    this.tutorias.forEach(t => {
      if (t.materia) {
        materiasSet.add(t.materia);
      }
    });
    this.materias = Array.from(materiasSet).sort();
  }

  /**
   * Filtrar por materia
   */
  filtrarPorMateria() {
    if (!this.materiaFiltro) {
      this.tutoriasFiltradas = [...this.tutorias];
      return;
    }

    this.loading = true;

    this.historialService.getTutoriasPorMateria(this.materiaFiltro).subscribe({
      next: (tutorias) => {
        this.tutoriasFiltradas = tutorias;
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error al filtrar:', err);
        // Filtrar localmente si falla el backend
        this.tutoriasFiltradas = this.tutorias.filter(
          t => t.materia === this.materiaFiltro
        );
        this.loading = false;
      }
    });
  }

  /**
   * Limpiar filtros
   */
  limpiarFiltros() {
    this.materiaFiltro = '';
    this.tutoriasFiltradas = [...this.tutorias];
  }

  /**
   * Ver detalle de una tutoría
   */
  verDetalle(tutoria: any) {
    console.log('👁️ Ver detalle:', tutoria);
    this.seleccionada = tutoria;
  }

  /**
   * Cerrar modal de detalle
   */
  cerrarDetalle() {
    this.seleccionada = null;
  }

  /**
   * Obtener clase CSS según el estado
   */
  getStatusClass(tutoria: any): string {
    switch (tutoria.estado) {
      case 'programada':
        return 'status-scheduled';
      case 'en_curso':
        return 'status-in-progress';
      case 'completada':
        return 'status-completed';
      case 'cancelada':
        return 'status-cancelled';
      default:
        return 'status-unknown';
    }
  }

  /**
   * Obtener texto legible del estado
   */
  getStatusText(tutoria: any): string {
    switch (tutoria.estado) {
      case 'programada':
        return 'Programada';
      case 'en_curso':
        return 'En Curso';
      case 'completada':
        return 'Completada';
      case 'cancelada':
        return 'Cancelada';
      default:
        return 'Desconocido';
    }
  }

  /**
   * Formatear duración en minutos
   */
  formatearDuracion(minutos: number): string {
    if (!minutos) return 'No especificada';

    if (minutos < 60) {
      return `${minutos} minutos`;
    }

    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;

    if (mins === 0) {
      return `${horas} ${horas === 1 ? 'hora' : 'horas'}`;
    }

    return `${horas}h ${mins}min`;
  }

  /**
   * Verificar si puede reagendar/cancelar
   */
  puedeReagendar(tutoria: any): boolean {
    // Solo puede cancelar/reagendar si está programada o en curso
    return tutoria.estado === 'programada' || tutoria.estado === 'en_curso';
  }

  /**
   * Cancelar tutoría
   */
  cancelarTutoria(tutoria: any) {
    if (!confirm(`¿Estás seguro de cancelar la tutoría de ${tutoria.materia}?`)) {
      return;
    }

    this.historialService.cancelarTutoria(tutoria.id).subscribe({
      next: () => {
        alert('Tutoría cancelada exitosamente');
        this.cerrarDetalle();
        this.cargarHistorial(); // Recargar lista
      },
      error: (err) => {
        alert(err.error?.message || 'Error al cancelar la tutoría');
      }
    });
  }

  /**
   * Reagendar tutoría
   */
  reagendarTutoria(tutoria: any) {
    // Redirigir a la página de edición
    this.router.navigate(['/tutorias/editar', tutoria.id]);
  }

  /**
   * Exportar historial a CSV
   */
  exportarHistorial() {
    if (this.tutoriasFiltradas.length === 0) {
      alert('No hay tutorías para exportar');
      return;
    }

    // Crear CSV
    const headers = ['Fecha', 'Hora', 'Materia', 'Tema', 'Tutor', 'Estudiante', 'Estado', 'Duración'];
    const rows = this.tutoriasFiltradas.map(t => [
      this.formatDate(t.fecha),
      this.formatTime(t.fecha),
      t.materia,
      t.tema,
      t.tutor?.nombre || 'N/A',
      t.estudiante?.nombre || 'N/A',
      this.getStatusText(t),
      this.formatearDuracion(t.duracion)
    ]);

    // Convertir a CSV
    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
      csvContent += row.map(cell => `"${cell}"`).join(',') + '\n';
    });

    // Descargar archivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `historial_tutorias_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log('✅ Historial exportado');
  }

  /**
   * Formatear fecha para export
   */
  private formatDate(fecha: string): string {
    const date = new Date(fecha);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  /**
   * Formatear hora para export
   */
  private formatTime(fecha: string): string {
    const date = new Date(fecha);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}
