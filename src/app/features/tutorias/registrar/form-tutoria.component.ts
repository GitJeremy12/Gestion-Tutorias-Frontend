import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TutoriaService } from '../../../core/services/tutoria.service';

@Component({
  standalone: true,
  selector: 'app-form-tutoria',
  imports: [CommonModule, FormsModule],
  templateUrl: './form-tutoria.component.html',
  styleUrls: ['./form-tutoria.component.css']
})
export class FormTutoriaComponent implements OnInit {

  estudiantes: any[] = [];

  form = {
    estudianteId: '',
    fechaHora: '',
    materia: '',
    tema: '',
    observaciones: '',
    duracion: null
  };

  error = '';
  success = '';

  constructor(private tutoriaService: TutoriaService) {}

  ngOnInit() {
    this.cargarEstudiantes();
  }

  cargarEstudiantes() {
    this.tutoriaService.getEstudiantes().subscribe({
      next: data => this.estudiantes = data,
      error: () => this.error = 'Error al cargar estudiantes'
    });
  }

  guardar(formRef: any) {
    this.error = '';
    this.success = '';

    if (!this.form.materia) {
      this.error = 'La materia es obligatoria';
      return;
    }

    this.tutoriaService.registrarTutoria(this.form).subscribe({
      next: () => {
        this.success = 'Tutoría registrada exitosamente';
        formRef.resetForm();
      },
      error: err => {
        this.error = err.error?.message || 'Error al registrar tutoría';
      }
    });
  }
}
