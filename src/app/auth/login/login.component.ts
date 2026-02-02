import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  form!: FormGroup;
  error = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  login() {
    if (this.form.invalid) return;

    const { email, password } = this.form.value;

    this.auth.login(email, password).subscribe({
      next: res => {
        switch (res.role) {
          case 'tutor':
            this.router.navigate(['/dashboard-tutor']);
            break;
          case 'estudiante':
            this.router.navigate(['/dashboard-estudiante']);
            break;
          case 'admin':
            this.router.navigate(['/admin']);
            break;
        }
      },
      error: err => this.error = err
    });
  }
}
