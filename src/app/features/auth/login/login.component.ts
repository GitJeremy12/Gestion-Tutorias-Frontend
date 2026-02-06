// login.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  error = '';
  loading = false;
  sessionExpired = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Verificar si llegó por sesión expirada
    this.sessionExpired = this.route.snapshot.queryParams['expired'] === 'true';

    // Si ya está autenticado, redirigir
    if (this.auth.isAuthenticated() && !this.auth.isTokenExpired()) {
      this.redirectByCurrentRole();
    }
  }

  login() {
    this.error = '';
    this.loading = true;

    // Validación básica
    if (!this.email || !this.password) {
      this.error = 'Por favor complete todos los campos';
      this.loading = false;
      return;
    }

    this.auth.login({ email: this.email, password: this.password })
      .subscribe({
        next: () => {
          this.auth.getProfile().subscribe({
            next: (res: any) => {
              const rol = res.user.rol;

              // Verificar returnUrl para redirigir después del login
              const returnUrl = this.route.snapshot.queryParams['returnUrl'];

              if (returnUrl) {
                this.router.navigateByUrl(returnUrl);
              } else {
                this.redirectByRole(rol);
              }
            },
            error: (err) => {
              this.error = 'Error al cargar el perfil';
              this.loading = false;
            }
          });
        },
        error: (err) => {
          this.error = err.error?.message || 'Email o contraseña incorrectos';
          this.loading = false;
        }
      });
  }

  private redirectByRole(rol: string) {
    switch (rol) {
      case 'tutor':
        this.router.navigate(['/dashboard-tutor']);
        break;
      case 'estudiante':
        this.router.navigate(['/dashboard-estudiante']);
        break;
      case 'admin':
        this.router.navigate(['/admin']);
        break;
      default:
        this.router.navigate(['/login']);
    }
  }

  private redirectByCurrentRole() {
    const rol = this.auth.currentUser()?.rol;
    if (rol) {
      this.redirectByRole(rol);
    }
  }
}
