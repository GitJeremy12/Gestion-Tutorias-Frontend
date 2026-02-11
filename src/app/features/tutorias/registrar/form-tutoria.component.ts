// form-tutoria.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TutoriaService } from '../../../core/services/tutoria.service';
import { AuthService } from '../../../core/services/auth.service';
import { NgForm } from '@angular/forms';
import { timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-form-tutoria',
  imports: [CommonModule, FormsModule],
  templateUrl: './form-tutoria.component.html',
  styleUrls: ['./form-tutoria.component.css']
})
export class FormTutoriaComponent implements OnInit {
  tutorId: number | null = null;
  guardando = false;
  error = '';
  success = '';

  form = {
    fecha: '',
    materia: '',
    tema: '',
    descripcion: '',
    duracion: 60,
    cupoMaximo: 10,
    modalidad: 'presencial' as 'presencial' | 'virtual' | 'hibrida',
    ubicacion: ''
  };

  cargandoPerfil = true;

  constructor(
    private tutoriaService: TutoriaService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('Iniciando FormTutoriaComponent...');
    this.cargarPerfilTutor();
    this.setDefaultDateTime();
  }

  cargarPerfilTutor() {
    this.cargandoPerfil = true;
    console.log('Cargando perfil del tutor...');

    this.authService.getProfile()
      .pipe(
        timeout(10000), // 10 segundos de timeout
        catchError((err) => {
          console.error('Error al cargar perfil:', err);
          this.error = 'Error al cargar información del tutor. Por favor, recarga la página.';
          this.cargandoPerfil = false;

          // Simular datos para desarrollo (QUITAR EN PRODUCCIÓN)
          // this.tutorId = 1;
          // this.cargandoPerfil = false;

          return of(null);
        })
      )
      .subscribe({
        next: (res: any) => {
          console.log('Respuesta del perfil:', res);

          if (!res) {
            console.warn('No se recibió respuesta del servidor');
            return;
          }

          // Verificar que el usuario sea tutor
          if (res.user?.rol !== 'tutor') {
            this.error = 'Solo los tutores pueden registrar tutorías';
            this.cargandoPerfil = false;
            console.warn('Usuario no es tutor:', res.user?.rol);
            return;
          }

          // Obtener el ID del tutor
          this.tutorId = res.profile?.id || res.user?.id;

          if (!this.tutorId) {
            this.error = 'No se pudo obtener el ID del tutor';
            console.error('tutorId no encontrado en la respuesta');
            this.cargandoPerfil = false;
            return;
          }

          console.log('Tutor cargado exitosamente. ID:', this.tutorId);
          this.cargandoPerfil = false;
        },
        error: (err) => {
          console.error('Error en subscribe:', err);
          this.error = 'Error al cargar datos del tutor';
          this.cargandoPerfil = false;
        }
      });
  }

  setDefaultDateTime() {
    const now = new Date();

    // Redondear a los próximos 15 minutos
    const minutes = now.getMinutes();
    const roundedMinutes = Math.ceil(minutes / 15) * 15;
    now.setMinutes(roundedMinutes, 0, 0);

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');

    this.form.fecha = `${year}-${month}-${day}T${hours}:${mins}`;
    console.log('Fecha por defecto establecida:', this.form.fecha);
  }

  guardar(form: NgForm) {
    console.log('Intentando guardar tutoría...');
    console.log('Formulario válido:', form.valid);
    console.log('Tutor ID:', this.tutorId);
    console.log('Datos del formulario:', this.form);

    // Validaciones
    if (form.invalid) {
      this.error = 'Por favor completa todos los campos obligatorios';
      console.warn('Formulario inválido');
      return;
    }

    if (!this.tutorId) {
      this.error = 'No se pudo identificar al tutor. Por favor, recarga la página.';
      console.error('No hay tutorId');
      return;
    }

    this.guardando = true;
    this.error = '';
    this.success = '';

    const data = {
      ...this.form,
      tutorId: this.tutorId
    };

    console.log('Enviando datos al servidor:', data);

    this.tutoriaService.registrarTutoria(data)
      .pipe(
        timeout(15000), // 15 segundos de timeout
        catchError((err) => {
          console.error('Error al registrar:', err);
          this.error = err.error?.message || 'Error al crear la tutoría. Por favor, intenta nuevamente.';
          this.guardando = false;
          return of(null);
        })
      )
      .subscribe({
        next: (response) => {
          if (response) {
            console.log('Tutoría creada exitosamente:', response);
            this.success = '¡Tutoría creada correctamente!';

            // Limpiar formulario después de 2 segundos
            setTimeout(() => {
              form.resetForm();
              this.setDefaultDateTime();

              // Opcional: redirigir al historial
              // this.router.navigate(['/historial']);
            }, 2000);
          }
          this.guardando = false;
        },
        error: (err) => {
          console.error('Error en subscribe:', err);
          this.error = 'Error al procesar la respuesta del servidor';
          this.guardando = false;
        }
      });
  }

  getMinDateTime() {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  }

  getMaxDateTime() {
    const d = new Date();
    d.setMonth(d.getMonth() + 6);
    return d.toISOString().slice(0, 16);
  }

  cancelar() {
    const hayDatos = this.form.materia || this.form.tema || this.form.descripcion;

    if (hayDatos) {
      if (confirm('¿Deseas cancelar? Se perderán los datos ingresados.')) {
        this.router.navigate(['/dashboard']);
      }
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  limpiarMensajes() {
    this.error = '';
    this.success = '';
  }

  // Método para pruebas (QUITAR EN PRODUCCIÓN)
  saltarCarga() {
    console.warn('⚠️ MODO DESARROLLO: Saltando carga de perfil');
    this.tutorId = 1; // ID temporal
    this.cargandoPerfil = false;
    this.error = '';
  }
}
