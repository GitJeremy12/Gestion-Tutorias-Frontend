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

  tutorias: any[] = [];
  tutoriaSeleccionada: number | null = null;

  loading = false;
  error = '';
  success = '';

  constructor(private agendamientoService: AgendamientoService) {}

  ngOnInit() {
    this.cargarTutorias();
  }

  cargarTutorias() {
    this.agendamientoService.getTutoriasDisponibles().subscribe({
      next: res => {
        this.tutorias = res.tutorias;
      },
      error: () => {
        this.error = 'Error al cargar las tutorías';
      }
    });
  }

  confirmar() {
    this.error = '';
    this.success = '';

    if (!this.tutoriaSeleccionada) {
      this.error = 'Selecciona una tutoría';
      return;
    }

    this.loading = true;

    this.agendamientoService
      .inscribirse(this.tutoriaSeleccionada)
      .subscribe({
        next: () => {
          this.success = '✅ Inscripción realizada correctamente';
          this.loading = false;
          this.tutoriaSeleccionada = null;
          this.cargarTutorias();
        },
        error: err => {
          this.error = err.error?.message || 'Error al inscribirse';
          this.loading = false;
        }
      });
  }
}
