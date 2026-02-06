import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
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

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  registrar() {
    this.error = '';
    this.success = '';

    // validaciones básicas frontend
    if (!this.form.email || !this.form.password || !this.form.nombre || !this.form.rol) {
      this.error = 'Complete todos los campos obligatorios';
      return;
    }

    if (this.form.password.length < 6) {
      this.error = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    if (this.form.rol === 'estudiante') {
      if (!this.form.matricula || !this.form.carrera || !this.form.semestre) {
        this.error = 'Complete todos los datos del estudiante';
        return;
      }
    }

    if (this.form.rol === 'tutor') {
      if (!this.form.especialidad || !this.form.departamento) {
        this.error = 'Complete todos los datos del tutor';
        return;
      }
    }

    this.authService.register(this.form).subscribe({
      next: () => {
        this.success = 'Registro exitoso. Inicia sesión para continuar';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: err => {
        this.error = err.error?.message || 'Error al registrar usuario';
      }
    });
  }
}
