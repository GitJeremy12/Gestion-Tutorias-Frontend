import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {

  form!: FormGroup;
  msg = '';
  error = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rol: ['', Validators.required],

      // estudiante
      matricula: [''],
      carrera: [''],
      semestre: [null],
      telefono: [''],

      // tutor
      especialidad: [''],
      departamento: [''],
      disponibilidad: [''],
    });
  }

  register() {
    this.msg = '';
    this.error = '';

    if (this.form.invalid) return;

    /* =======================
       VALIDACIÓN ESTUDIANTE
    ======================= */
    if (this.form.value.rol === 'estudiante') {

      if (
        !this.form.value.matricula ||
        !this.form.value.carrera ||
        this.form.value.semestre === null ||
        this.form.value.semestre === ''
      ) {
        this.error = 'Complete todos los datos del estudiante';
        return;
      }

      // convertir semestre a número
      this.form.value.semestre = Number(this.form.value.semestre);

      if (
        isNaN(this.form.value.semestre) ||
        this.form.value.semestre < 1 ||
        this.form.value.semestre > 12
      ) {
        this.error = 'El semestre debe estar entre 1 y 12';
        return;
      }
    }

    /* ===================
       VALIDACIÓN TUTOR
    =================== */
    if (this.form.value.rol === 'tutor') {

      if (
        !this.form.value.especialidad ||
        !this.form.value.departamento ||
        !this.form.value.disponibilidad
      ) {
        this.error = 'Complete todos los datos del tutor';
        return;
      }

      // convertir disponibilidad a JSON
      try {
        this.form.value.disponibilidad =
          JSON.parse(this.form.value.disponibilidad);
      } catch {
        this.error = 'La disponibilidad debe tener formato JSON válido';
        return;
      }
    }

    /* ===================
       ENVÍO AL BACKEND
    =================== */
    this.auth.register(this.form.value).subscribe({
      next: res => {
        this.msg = res.message;
        this.form.reset();
      },
      error: err => {
        this.error = err.error?.message || 'Error al registrar';
      }
    });
  }
}
