// src/app/core/services/tutoria.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TutoriaService {

  private API = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getEstudiantes() {
    return this.http.get<any[]>(`${this.API}/estudiantes`);
  }

  registrarTutoria(data: any) {
    return this.http.post(`${this.API}/tutorias`, data);
  }
}
