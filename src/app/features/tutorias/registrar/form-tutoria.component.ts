import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
  estudianteSeleccionado: any = null;

  form = {
    estudianteId: '',
    fechaHora: '',
    materia: '',
    tema: '',
    observaciones: '',
    duracion: 60
  };

  error = '';
  success = '';
  guardando = false;

  constructor(
    private tutoriaService: TutoriaService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarEstudiantes();
    this.setDefaultDateTime();
  }

  cargarEstudiantes() {
    this.tutoriaService.getEstudiantes().subscribe({
      next: data => {
        this.estudiantes = data;
      },
      error: () => {
        this.error = 'Error al cargar la lista de estudiantes';
      }
    });
  }

  // Establecer fecha y hora actual por defecto
  setDefaultDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    this.form.fechaHora = `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  // Obtener fecha máxima permitida (1 año adelante)
  getMaxDateTime(): string {
    const future = new Date();
    future.setFullYear(future.getFullYear() + 1);

    const year = future.getFullYear();
    const month = String(future.getMonth() + 1).padStart(2, '0');
    const day = String(future.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}T23:59`;
  }

  // Cuando cambia el estudiante seleccionado
  onEstudianteChange() {
    this.estudianteSeleccionado = this.estudiantes.find(
      e => e.id === +this.form.estudianteId
    ) || null;
  }

  // Guardar tutoría
  guardar(formRef: any) {
    this.error = '';
    this.success = '';

    // Validaciones
    if (!this.form.materia || !this.form.materia.trim()) {
      this.error = 'La materia es obligatoria';
      return;
    }

    if (!this.form.duracion || this.form.duracion < 15) {
      this.error = 'La duración mínima es de 15 minutos';
      return;
    }

    if (this.form.duracion > 300) {
      this.error = 'La duración máxima es de 300 minutos (5 horas)';
      return;
    }

    if (!this.form.estudianteId) {
      this.error = 'Debes seleccionar un estudiante';
      return;
    }

    if (!this.form.fechaHora) {
      this.error = 'Debes seleccionar fecha y hora';
      return;
    }

    this.guardando = true;

    this.tutoriaService.registrarTutoria(this.form).subscribe({
      next: (response) => {
        this.success = '✓ Tutoría registrada exitosamente';
        this.guardando = false;

        // Resetear formulario después de 2 segundos
        setTimeout(() => {
          formRef.resetForm();
          this.estudianteSeleccionado = null;
          this.form.duracion = 60;
          this.setDefaultDateTime();
          this.success = '';

          // Opcional: redirigir al historial
          // this.router.navigate(['/historial']);
        }, 2000);
      },
      error: err => {
        this.error = err.error?.message || 'Error al registrar la tutoría. Intenta nuevamente.';
        this.guardando = false;
        console.error('Error al guardar:', err);
      }
    });
  }

  // Cancelar y volver
  cancelar() {
    const hayDatos = this.form.estudianteId ||
                     this.form.materia ||
                     this.form.tema ||
                     this.form.observaciones;

    if (hayDatos) {
      if (confirm('¿Estás seguro de que deseas cancelar? Se perderán los datos ingresados.')) {
        this.router.navigate(['/historial']);
      }
    } else {
      this.router.navigate(['/historial']);
    }
  }

  // Limpiar mensajes
  limpiarMensajes() {
    this.error = '';
    this.success = '';
  }
}
