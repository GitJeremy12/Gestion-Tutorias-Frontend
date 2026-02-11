// register.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  form: any = {
    email: '',
    password: '',
    nombre: '',
    rol: '',
    // estudiante
    matricula: '',
    carrera: '',
    semestre: null,
    telefono: '',
    // tutor
    especialidad: '',
    departamento: '',
    disponibilidad: ''
  };

  error = '';
  success = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  registrar() {
    this.error = '';
    this.success = '';
    this.loading = true;

    // Validaciones básicas frontend
    if (!this.form.email || !this.form.password || !this.form.nombre || !this.form.rol) {
      this.error = 'Complete todos los campos obligatorios';
      this.loading = false;
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.form.email)) {
      this.error = 'Ingrese un email válido';
      this.loading = false;
      return;
    }

    if (this.form.password.length < 6) {
      this.error = 'La contraseña debe tener al menos 6 caracteres';
      this.loading = false;
      return;
    }

    // Validaciones por rol
    if (this.form.rol === 'estudiante') {
      if (!this.form.matricula || !this.form.carrera || !this.form.semestre) {
        this.error = 'Complete todos los datos del estudiante';
        this.loading = false;
        return;
      }

      if (this.form.semestre < 1 || this.form.semestre > 12) {
        this.error = 'El semestre debe estar entre 1 y 12';
        this.loading = false;
        return;
      }
    }

    if (this.form.rol === 'tutor') {
      if (!this.form.especialidad || !this.form.departamento) {
        this.error = 'Complete todos los datos del tutor';
        this.loading = false;
        return;
      }
    }

    // ✅ IMPORTANTE: Preparar datos según el rol
    const dataToSend: any = {
      email: this.form.email.trim().toLowerCase(),
      password: this.form.password,
      nombre: this.form.nombre.trim(),
      rol: this.form.rol
    };

    // Agregar datos específicos según el rol
    if (this.form.rol === 'estudiante') {
      dataToSend.matricula = this.form.matricula.trim();
      dataToSend.carrera = this.form.carrera.trim();
      dataToSend.semestre = Number(this.form.semestre);
      if (this.form.telefono) {
        dataToSend.telefono = this.form.telefono.trim();
      }
    } else if (this.form.rol === 'tutor') {
      dataToSend.especialidad = this.form.especialidad.trim();
      dataToSend.departamento = this.form.departamento.trim();

      // ✅ Convertir disponibilidad a JSON
      if (this.form.disponibilidad && this.form.disponibilidad.trim()) {
        dataToSend.disponibilidad = {
          horario: this.form.disponibilidad.trim()
        };
      } else {
        // ✅ Enviar objeto vacío si no hay disponibilidad
        dataToSend.disponibilidad = {};
      }
    }

    // Log para debug (puedes quitarlo después)
    console.log('📤 Enviando datos:', dataToSend);

    this.authService.register(dataToSend).subscribe({
      next: (res) => {
        console.log('✅ Respuesta del servidor:', res);
        this.success = '✅ Registro exitoso. Redirigiendo al login...';
        this.resetForm();
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: err => {
        console.error('❌ Error completo:', err);
        console.error('❌ Error del servidor:', err.error);
        this.error = err.error?.message || 'Error al registrar usuario';
        this.loading = false;
      }
    });
  }

  resetForm() {
    this.form = {
      email: '',
      password: '',
      nombre: '',
      rol: '',
      matricula: '',
      carrera: '',
      semestre: null,
      telefono: '',
      especialidad: '',
      departamento: '',
      disponibilidad: ''
    };
  }

  isEstudiante(): boolean {
    return this.form.rol === 'estudiante';
  }

  isTutor(): boolean {
    return this.form.rol === 'tutor';
  }
}
