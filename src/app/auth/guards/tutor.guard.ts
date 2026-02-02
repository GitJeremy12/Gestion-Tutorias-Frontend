import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class TutorGuard {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');

    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    const role = JSON.parse(atob(token)).role;

    if (role !== 'tutor') {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}
