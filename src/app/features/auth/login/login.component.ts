// login.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.error = '';

    this.auth.login({ email: this.email, password: this.password })
      .subscribe({
        next: () => {
          this.auth.getProfile().subscribe((res: any) => {
            const rol = res.user.rol;

            if (rol === 'tutor') this.router.navigate(['/dashboard-tutor']);
            else if (rol === 'estudiante') this.router.navigate(['/dashboard-estudiante']);
            else this.router.navigate(['/admin']);
          });
        },
        error: () => {
          this.error = 'Email o contraseña incorrectos';
        }
      });
  }
}
