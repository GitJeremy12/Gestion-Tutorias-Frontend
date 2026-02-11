// src/app/core/guards/auth.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const token = localStorage.getItem('token');

  if (!token) {
    router.navigate(['/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  // Verificar si el token es válido (opcional pero recomendado)
  if (authService.isTokenExpired()) {
    localStorage.removeItem('token');
    router.navigate(['/login'], {
      queryParams: { expired: 'true' }
    });
    return false;
  }

  return true;
};
