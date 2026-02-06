import { Injectable } from "@angular/core";
import { Observable, of, throwError } from "rxjs";
import { HttpClient } from '@angular/common/http';
import { TokenService } from "./token.service";
@Injectable({ providedIn: 'root' })
export class AuthService {

  
  private apiUrl = 'http://localhost:3000/api';
  constructor(private http: HttpClient, private tokenService: TokenService) {}

 login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, {
      email,
      password
    });
    
  }

  saveSession(token: string) {
    this.tokenService.setToken(token);
  }

 register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
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

  const payload = JSON.parse(atob(token.split('.')[1]));
  return payload.rol;
 }
}