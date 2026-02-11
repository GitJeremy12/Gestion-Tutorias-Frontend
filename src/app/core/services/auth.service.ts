// src/app/core/services/auth.service.ts
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

// Interfaces
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  nombre: string;
  rol: 'estudiante' | 'tutor';
  // Estudiante
  matricula?: string;
  carrera?: string;
  semestre?: number;
  telefono?: string;
  // Tutor
  especialidad?: string;
  departamento?: string;
  disponibilidad?: string;
}

export interface User {
  id: number;
  email: string;
  nombre: string;
  rol: 'admin' | 'tutor' | 'estudiante';
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EstudianteProfile {
  id: number;
  userId: number;
  matricula: string;
  carrera: string;
  semestre: number;
  telefono?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TutorProfile {
  id: number;
  userId: number;
  especialidad: string;
  departamento: string;
  disponibilidad?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileResponse {
  user: User;
  profile: EstudianteProfile | TutorProfile | null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private API = environment.apiUrl;

  // Signal para estado reactivo del usuario
  currentUser = signal<User | null>(null);
  currentProfile = signal<EstudianteProfile | TutorProfile | null>(null);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Cargar perfil si hay token válido al iniciar
    if (this.isAuthenticated() && !this.isTokenExpired()) {
      this.loadProfile();
    }
  }

  // Login
  login(data: LoginRequest): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.API}/login`, data)
      .pipe(
        tap(res => {
          localStorage.setItem('token', res.token);
          this.loadProfile();
        })
      );
  }

  // Register
  register(data: RegisterRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.API}/register`, data);
  }

  // Get Profile
  getProfile(): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(`${this.API}/auth/profile`);
  }

  // Load Profile (cargar datos del usuario actual)
  loadProfile(): void {
    this.getProfile().subscribe({
      next: (res) => {
        this.currentUser.set(res.user);
        this.currentProfile.set(res.profile);
      },
      error: () => {
        this.logout();
      }
    });
  }

  // Update Profile
  updateProfile(data: any): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.API}/auth/profile`, data)
      .pipe(
        tap(() => this.loadProfile()) // Recargar perfil después de actualizar
      );
  }

  // Logout
  logout(): void {
    localStorage.removeItem('token');
    this.currentUser.set(null);
    this.currentProfile.set(null);
    this.router.navigate(['/login']);
  }

  // Verificar si está autenticado
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  // Obtener token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Verificar si el token expiró
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      // Decodificar el payload del JWT (formato: header.payload.signature)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp;

      // exp está en segundos, Date.now() en milisegundos
      return (Math.floor(Date.now() / 1000)) >= expiry;
    } catch (e) {
      // Si no se puede decodificar, asumir que expiró
      return true;
    }
  }

  // Verificar si el usuario tiene un rol específico
  hasRole(rol: string): boolean {
    return this.currentUser()?.rol === rol;
  }

  // Verificar si el usuario tiene alguno de los roles permitidos
  hasAnyRole(roles: string[]): boolean {
    const userRole = this.currentUser()?.rol;
    return userRole ? roles.includes(userRole) : false;
  }

  // Obtener el rol del usuario actual
  getCurrentRole(): string | null {
    return this.currentUser()?.rol || null;
  }

  // Verificar si el usuario está activo
  isActive(): boolean {
    return this.currentUser()?.activo || false;
  }
}
