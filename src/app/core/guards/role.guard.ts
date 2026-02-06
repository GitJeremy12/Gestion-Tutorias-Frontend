// src/app/core/guards/role.guard.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Si no hay usuario cargado, intentar cargar el perfil
    const currentUser = authService.currentUser();

    if (!currentUser) {
      // Intentar cargar el perfil primero
      return authService.getProfile().pipe(
        map(res => {
          if (allowedRoles.includes(res.user.rol)) {
            return true;
          }
          router.navigate(['/unauthorized']);
          return false;
        })
      );
    }

    // Si ya hay usuario, verificar rol
    if (allowedRoles.includes(currentUser.rol)) {
      return true;
    }

    // Redirigir según el rol del usuario
    redirectByRole(currentUser.rol, router);
    return false;
  };
};

// Helper para redirigir según rol
function redirectByRole(rol: string, router: Router) {
  switch (rol) {
    case 'admin':
      router.navigate(['/admin']);
      break;
    case 'tutor':
      router.navigate(['/dashboard-tutor']);
      break;
    case 'estudiante':
      router.navigate(['/dashboard-estudiante']);
      break;
    default:
      router.navigate(['/login']);
  }
}
