import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TutoriaService } from '../services/tutoria.service';

@Component({
  selector: 'app-registrar-tutoria',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registrar-tutoria.component.html'
})
export class RegistrarTutoriaComponent implements OnInit {

  form!: FormGroup;
  estudiantes: any[] = [];
  success = '';
  error = '';

  constructor(
    private fb: FormBuilder,
    private tutoriaService: TutoriaService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      estudianteId: ['', Validators.required],
      fechaHora: ['', Validators.required],
      materia: ['', Validators.required],
      tema: [''],
      observaciones: [''],
      duracion: ['', [Validators.required, Validators.min(1)]]
    });

    this.cargarEstudiantes();
  }

  cargarEstudiantes() {
    this.tutoriaService.obtenerEstudiantes().subscribe(data => {
      this.estudiantes = data;
    });
  }

  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.tutoriaService.registrarTutoria(this.form.value).subscribe({
      next: () => {
        this.success = 'Tutoría registrada exitosamente';
        this.error = '';
        this.form.reset();
      },
      error: () => {
        this.error = 'Error al registrar la tutoría';
      }
    });
  }
}
