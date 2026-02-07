// form-tutoria.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TutoriaService } from '../../../core/services/tutoria.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-form-tutoria',
  imports: [CommonModule, FormsModule],
  templateUrl: './form-tutoria.component.html',
  styleUrls: ['./form-tutoria.component.css']
})
export class FormTutoriaComponent implements OnInit {
  tutorId: number = 0;

  form = {
    fechaHora: '',
    materia: '',
    tema: '',
    descripcion: '',
    duracion: 60,
    cupoMaximo: 10,
    modalidad: 'presencial' as 'presencial' | 'virtual' | 'hibrida',
    ubicacion: ''
  };

  error = '';
  success = '';
  guardando = false;
  cargandoPerfil = true;

  constructor(
    private tutoriaService: TutoriaService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarPerfilTutor();
    this.setDefaultDateTime();
  }

  cargarPerfilTutor() {
    this.cargandoPerfil = true;

    this.authService.getProfile().subscribe({
      next: (res: any) => {
        if (res.user.rol !== 'tutor') {
          this.error = 'Solo los tutores pueden registrar tutorías';
          this.cargandoPerfil = false;
          return;
        }

        this.tutorId = res.profile?.id;

        if (!this.tutorId) {
          this.error = 'No se pudo obtener el ID del tutor';
          this.cargandoPerfil = false;
          return;
        }

        this.cargandoPerfil = false;
      },
      error: (err) => {
        this.error = 'Error al cargar datos del tutor';
        this.cargandoPerfil = false;
      }
    });
  }

  setDefaultDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    this.form.fechaHora = `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  getMinDateTime(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  getMaxDateTime(): string {
    const future = new Date();
    future.setFullYear(future.getFullYear() + 1);

    const year = future.getFullYear();
    const month = String(future.getMonth() + 1).padStart(2, '0');
    const day = String(future.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}T23:59`;
  }

  guardar(formRef: any) {
    this.error = '';
    this.success = '';

    if (!this.tutorId) {
      this.error = 'No se pudo identificar al tutor. Recarga la página.';
      return;
    }

    if (!this.form.materia || !this.form.materia.trim()) {
      this.error = 'La materia es obligatoria';
      return;
    }

    if (!this.form.tema || !this.form.tema.trim()) {
      this.error = 'El tema es obligatorio';
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

    if (!this.form.fechaHora) {
      this.error = 'Debes seleccionar fecha y hora';
      return;
    }

    this.guardando = true;

    const datosParaBackend = {
      tutorId: this.tutorId,
      fecha: this.form.fechaHora,
      materia: this.form.materia.trim(),
      tema: this.form.tema.trim(),
      descripcion: this.form.descripcion?.trim() || undefined,
      duracion: Number(this.form.duracion),
      cupoMaximo: Number(this.form.cupoMaximo),
      modalidad: this.form.modalidad,
      ubicacion: this.form.ubicacion?.trim() || undefined
    };

    console.log('📤 Enviando al backend:', datosParaBackend);

    this.tutoriaService.registrarTutoria(datosParaBackend).subscribe({
      next: (response) => {
        console.log('✅ Tutoría creada:', response);
        this.success = '✓ Sesión grupal creada exitosamente. Los estudiantes podrán inscribirse.';
        this.guardando = false;

        setTimeout(() => {
          this.router.navigate(['/historial']);
        }, 2000);
      },
      error: err => {
        console.error('❌ Error:', err);
        this.error = err.error?.message || 'Error al registrar la tutoría';
        this.guardando = false;
      }
    });
  }

  cancelar() {
    const hayDatos = this.form.materia || this.form.tema || this.form.descripcion;

    if (hayDatos) {
      if (confirm('¿Deseas cancelar? Se perderán los datos ingresados.')) {
        this.router.navigate(['/historial']);
      }
    } else {
      this.router.navigate(['/historial']);
    }
  }

  limpiarMensajes() {
    this.error = '';
    this.success = '';
  }
}
