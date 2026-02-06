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

  constructor(private agendamientoService: AgendamientoService) {}

  ngOnInit() {
    this.cargarTutores();
  }

  cargarTutores() {
    this.agendamientoService.getTutores().subscribe({
      next: data => this.tutores = data,
      error: () => this.error = 'Error al cargar tutores'
    });
  }

  validarHorario() {
    this.error = '';
    this.disponible = false;
    this.horariosAlternativos = [];

    if (!this.form.tutorId || !this.form.fechaHora) return;

    this.agendamientoService
      .validarDisponibilidad(+this.form.tutorId, this.form.fechaHora)
      .subscribe({
        next: (res: any) => {
          this.disponible = res.disponible;
          if (!res.disponible) {
            this.error = 'El tutor no está disponible en este horario';
            this.horariosAlternativos = res.alternativos || [];
          }
        },
        error: () => this.error = 'Error al validar disponibilidad'
      });
  }

  confirmar(formRef: any) {
    this.error = '';
    this.success = '';

    if (!this.disponible) {
      this.error = 'Este horario ya no está disponible';
      return;
    }

    this.agendamientoService.agendarTutoria(this.form).subscribe({
      next: () => {
        this.success = 'Tutoría agendada exitosamente';
        formRef.resetForm();
      },
      error: err => {
        this.error = err.error?.message || 'Error al agendar tutoría';
      }
    });
  }
}
