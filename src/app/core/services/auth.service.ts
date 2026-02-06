// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private API = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(data: { email: string; password: string }) {
    return this.http.post<{ token: string }>(`${this.API}/login`, data)
      .pipe(
        tap(res => localStorage.setItem('token', res.token))
      );
  }

  register(data: any) {
    return this.http.post(`${this.API}/register`, data);
  }

  getProfile() {
    return this.http.get(`${this.API}/auth/profile`);
  }

  logout() {
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
