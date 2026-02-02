import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TutoriaService } from '../services/tutoria.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-agendar-tutoria',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './agendar-tutoria.component.html'
})
export class AgendarTutoriaComponent implements OnInit {

  form!: FormGroup;
  tutores: any[] = [];
  horariosAlternativos: string[] = [];

  mensaje = '';
  error = '';

  constructor(
    private fb: FormBuilder,
    private tutoriaService: TutoriaService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      tutor_id: ['', Validators.required],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      materia: ['', Validators.required],
      tema: ['', Validators.required]
    });

    this.cargarTutores();
  }

  cargarTutores() {
    this.tutoriaService.getTutores().subscribe({
      next: res => this.tutores = res,
      error: () => this.error = 'Error al cargar tutores'
    });
  }

  validarDisponibilidad() {
    if (
      this.form.get('tutor_id')?.invalid ||
      this.form.get('fecha')?.invalid ||
      this.form.get('hora')?.invalid
    ) return;

    this.tutoriaService.validarDisponibilidad(this.form.value).subscribe({
      next: () => {
        this.error = '';
        this.horariosAlternativos = [];
      },
      error: err => {
        this.error = err.error?.message ||
          'El tutor no está disponible en este horario';
        this.horariosAlternativos = err.error?.horarios || [];
      }
    });
  }

  agendar() {
    if (this.form.invalid) return;

    this.tutoriaService.agendarTutoria(this.form.value).subscribe({
      next: () => {
        this.mensaje = 'Tutoría agendada exitosamente';
        this.error = '';
        this.form.reset();
      },
      error: err => {
        this.error = err.error?.message || 'Horario no disponible';
        this.horariosAlternativos = err.error?.horarios || [];
      }
    });
  }
}
