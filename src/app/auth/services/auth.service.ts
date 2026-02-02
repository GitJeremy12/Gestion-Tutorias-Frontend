import { Injectable } from "@angular/core";
import { Observable, of, throwError } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AuthService {

  private MOCK_USERS = [
    { email: 'estudiante@test.com', password: '123456', role: 'estudiante' },
    { email: 'tutor@test.com', password: '123456', role: 'tutor' },
    { email: 'admin@test.com', password: '123456', role: 'admin' }
  ];

  login(email: string, password: string): Observable<any> {
    const user = this.MOCK_USERS.find(
      u => u.email === email && u.password === password
    );

    if (!user) {
      return throwError(() => 'Email o contraseña incorrectos');
    }

    // 🔑 JWT simulado
    const fakeToken = btoa(JSON.stringify({
      email: user.email,
      role: user.role,
      exp: Date.now() + (7 * 24 * 60 * 60 * 1000)
    }));

    localStorage.setItem('token', fakeToken);

    return of({ token: fakeToken, role: user.role });
  }

  register(data: any): Observable<any> {
    return of({ message: 'Registro exitoso. Inicia sesión para continuar' });
  }

  logout() {
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getUserRole(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    return JSON.parse(atob(token)).role;
  }
}
