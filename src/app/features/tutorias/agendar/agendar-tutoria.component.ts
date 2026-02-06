import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgendamientoService } from '../../../core/services/agendamiento.service';

@Component({
  standalone: true,
  selector: 'app-agendar-tutoria',
  imports: [CommonModule, FormsModule],
  templateUrl: './agendar-tutoria.component.html',
  styleUrls: ['./agendar-tutoria.component.css']
})
export class AgendarTutoriaComponent implements OnInit {
  tutores: any[] = [];
  tutorSeleccionado: any = null;
  horariosAlternativos: string[] = [];

  form = {
    tutorId: '',
    fechaHora: '',
    materia: '',
    tema: ''
  };

  error = '';
  success = '';
  disponible = false;
  validandoHorario = false;

  constructor(private agendamientoService: AgendamientoService) {}

  ngOnInit() {
    this.cargarTutores();
    this.setMinDateTime();
  }

  cargarTutores() {
    this.agendamientoService.getTutores().subscribe({
      next: data => {
        this.tutores = data;
      },
      error: () => {
        this.error = 'Error al cargar la lista de tutores';
      }
    });
  }

  // Método para establecer la fecha mínima (hoy)
  setMinDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    const minDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;

    // Puedes usar esto en el template con [min]="minDateTime"
    return minDateTime;
  }

  // Método que se ejecuta cuando cambia el tutor
  onTutorChange() {
    this.tutorSeleccionado = this.tutores.find(t => t.id === +this.form.tutorId) || null;
    this.disponible = false;
    this.horariosAlternativos = [];
    this.error = '';

    // Si ya hay fecha seleccionada, validar
    if (this.form.fechaHora) {
      this.validarHorario();
    }
  }

  validarHorario() {
    this.error = '';
    this.disponible = false;
    this.horariosAlternativos = [];

    if (!this.form.tutorId || !this.form.fechaHora) {
      return;
    }

    // Validar que la fecha no sea en el pasado
    const fechaSeleccionada = new Date(this.form.fechaHora);
    const ahora = new Date();

    if (fechaSeleccionada < ahora) {
      this.error = 'No puedes agendar tutorías en fechas pasadas';
      return;
    }

    this.validandoHorario = true;

    this.agendamientoService
      .validarDisponibilidad(+this.form.tutorId, this.form.fechaHora)
      .subscribe({
        next: (res: any) => {
          this.validandoHorario = false;
          this.disponible = res.disponible;

          if (!res.disponible) {
            this.error = 'El tutor no está disponible en este horario';
            this.horariosAlternativos = res.alternativos || [];
          } else {
            this.success = ''; // Limpiar mensaje de éxito previo
          }
        },
        error: () => {
          this.validandoHorario = false;
          this.error = 'Error al validar disponibilidad del tutor';
        }
      });
  }

  // Método para seleccionar un horario alternativo
  seleccionarHorarioAlternativo(horario: string) {
    this.form.fechaHora = horario;
    this.validarHorario();
  }

  confirmar(formRef: any) {
    this.error = '';
    this.success = '';

    if (!this.disponible) {
      this.error = 'Por favor selecciona un horario disponible';
      return;
    }

    // Validación adicional de campos
    if (!this.form.materia.trim() || !this.form.tema.trim()) {
      this.error = 'Por favor completa todos los campos obligatorios';
      return;
    }

    this.agendamientoService.agendarTutoria(this.form).subscribe({
      next: () => {
        this.success = '¡Tutoría agendada exitosamente! Recibirás una confirmación por correo.';

        // Resetear formulario después de 2 segundos
        setTimeout(() => {
          formRef.resetForm();
          this.tutorSeleccionado = null;
          this.disponible = false;
          this.horariosAlternativos = [];
          this.success = '';
        }, 3000);
      },
      error: err => {
        this.error = err.error?.message || 'Error al agendar la tutoría. Intenta nuevamente.';
      }
    });
  }

  // Método para limpiar mensajes
  limpiarMensajes() {
    this.error = '';
    this.success = '';
  }

  // Método para formatear fecha (opcional, para mostrar horarios alternativos)
  formatearFecha(fecha: string): string {
    const date = new Date(fecha);
    const opciones: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('es-ES', opciones);
  }
}
