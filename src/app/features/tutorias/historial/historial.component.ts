import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HistorialService } from '../../../core/services/historial.service';

@Component({
  standalone: true,
  selector: 'app-historial',
  imports: [CommonModule, FormsModule],
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent implements OnInit {
  tutorias: any[] = [];
  tutoriasFiltradas: any[] = [];
  materias: string[] = [];
  materiaFiltro = '';
  seleccionada: any = null;
  loading = false;
  error = '';

  constructor(
    private historialService: HistorialService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarHistorial();
  }

  cargarHistorial() {
    this.loading = true;
    this.error = '';

    this.historialService.getHistorial().subscribe({
      next: data => {
        // Orden descendente por fecha
        this.tutorias = data.sort(
          (a, b) => new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime()
        );
        this.tutoriasFiltradas = [...this.tutorias];

        // Extraer materias únicas y ordenarlas alfabéticamente
        this.materias = [...new Set(this.tutorias.map(t => t.materia))].sort();

        this.loading = false;
      },
      error: err => {
        this.error = 'Error al cargar el historial de tutorías';
        this.loading = false;
        console.error('Error:', err);
      }
    });
  }

  filtrarPorMateria() {
    if (!this.materiaFiltro) {
      this.tutoriasFiltradas = [...this.tutorias];
      return;
    }
    this.tutoriasFiltradas = this.tutorias.filter(
      t => t.materia === this.materiaFiltro
    );
  }

  verDetalle(tutoria: any) {
    this.seleccionada = tutoria;
    // Prevenir scroll del body cuando el modal está abierto
    document.body.style.overflow = 'hidden';
  }

  cerrarDetalle() {
    this.seleccionada = null;
    // Restaurar scroll del body
    document.body.style.overflow = 'auto';
  }

  // Método para obtener la clase CSS del estado
  getStatusClass(tutoria: any): string {
    const estado = tutoria.estado?.toLowerCase() || this.determinarEstado(tutoria);

    switch (estado) {
      case 'completada':
      case 'realizada':
        return 'completada';
      case 'pendiente':
      case 'agendada':
        return 'pendiente';
      case 'cancelada':
        return 'cancelada';
      default:
        return 'pendiente';
    }
  }

  // Método para obtener el texto del estado
  getStatusText(tutoria: any): string {
    const estado = tutoria.estado?.toLowerCase() || this.determinarEstado(tutoria);

    switch (estado) {
      case 'completada':
      case 'realizada':
        return 'Completada';
      case 'pendiente':
      case 'agendada':
        return 'Pendiente';
      case 'cancelada':
        return 'Cancelada';
      default:
        return this.esFutura(tutoria) ? 'Pendiente' : 'Completada';
    }
  }

  // Determinar estado basado en la fecha si no viene en los datos
  private determinarEstado(tutoria: any): string {
    const fechaTutoria = new Date(tutoria.fechaHora);
    const ahora = new Date();

    if (fechaTutoria > ahora) {
      return 'pendiente';
    } else {
      return 'completada';
    }
  }

  // Verificar si la tutoría es futura
  esFutura(tutoria: any): boolean {
    const fechaTutoria = new Date(tutoria.fechaHora);
    const ahora = new Date();
    return fechaTutoria > ahora;
  }

  // Verificar si se puede reagendar
  puedeReagendar(tutoria: any): boolean {
    const estado = tutoria.estado?.toLowerCase() || this.determinarEstado(tutoria);

    // Solo se puede reagendar si está pendiente o es futura
    if (estado === 'completada' || estado === 'cancelada') {
      return false;
    }

    return this.esFutura(tutoria);
  }

  // Reagendar tutoría
  reagendarTutoria(tutoria: any) {
    // Aquí podrías implementar la lógica para reagendar
    // Por ejemplo, navegar al formulario de agendamiento con datos prellenados
    this.cerrarDetalle();
    this.router.navigate(['/agendar'], {
      queryParams: {
        reagendar: tutoria.id,
        tutorId: tutoria.tutor?.id,
        materia: tutoria.materia,
        tema: tutoria.tema
      }
    });
  }

  // Cancelar tutoría
  cancelarTutoria(tutoria: any) {
    if (!confirm('¿Estás seguro de que deseas cancelar esta tutoría?')) {
      return;
    }

    this.historialService.cancelarTutoria(tutoria.id).subscribe({
      next: () => {
        // Actualizar el estado local
        tutoria.estado = 'cancelada';
        this.cerrarDetalle();
        // Recargar historial
        this.cargarHistorial();
      },
      error: (err: any) => {
        this.error = 'Error al cancelar la tutoría';
        console.error('Error:', err);
      }
    });
  }

  // Formatear duración
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

    return `${horas}h ${mins}m`;
  }

  // Obtener estadísticas
  getEstadisticas() {
    return {
      total: this.tutoriasFiltradas.length,
      completadas: this.tutoriasFiltradas.filter(t =>
        this.getStatusClass(t) === 'completada'
      ).length,
      pendientes: this.tutoriasFiltradas.filter(t =>
        this.getStatusClass(t) === 'pendiente'
      ).length,
      canceladas: this.tutoriasFiltradas.filter(t =>
        this.getStatusClass(t) === 'cancelada'
      ).length,
      materias: this.materias.length
    };
  }

  // Exportar historial (opcional)
  exportarHistorial() {
    // Convertir a CSV
    const headers = ['Fecha', 'Hora', 'Materia', 'Tema', 'Tutor', 'Estado', 'Duración'];
    const rows = this.tutoriasFiltradas.map(t => [
      new Date(t.fechaHora).toLocaleDateString('es-ES'),
      new Date(t.fechaHora).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      t.materia,
      t.tema,
      t.tutor?.nombre || 'N/A',
      this.getStatusText(t),
      this.formatearDuracion(t.duracion)
    ]);

    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
      csv += row.map(cell => `"${cell}"`).join(',') + '\n';
    });

    // Descargar archivo
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `historial-tutorias-${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Buscar por texto (opcional, para implementar búsqueda)
  buscarPorTexto(texto: string) {
    if (!texto.trim()) {
      this.filtrarPorMateria();
      return;
    }

    const busqueda = texto.toLowerCase();
    this.tutoriasFiltradas = this.tutorias.filter(t =>
      t.materia.toLowerCase().includes(busqueda) ||
      t.tema.toLowerCase().includes(busqueda) ||
      t.tutor?.nombre.toLowerCase().includes(busqueda) ||
      t.estudiante?.nombre.toLowerCase().includes(busqueda)
    );
  }

  // Limpiar filtros
  limpiarFiltros() {
    this.materiaFiltro = '';
    this.tutoriasFiltradas = [...this.tutorias];
  }
}
