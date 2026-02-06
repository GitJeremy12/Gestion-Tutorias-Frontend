import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class TutorGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');

    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    try {
      // 👉 decodificar SOLO el payload
      const payload = JSON.parse(atob(token.split('.')[1]));

      if (payload.rol === 'tutor') {
        return true;
      }

      this.router.navigate(['/login']);
      return false;

    } catch (error) {
      // token corrupto o inválido
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
      return false;
    }
  }
}
