// src/app/core/services/agendamiento.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';


@Injectable({ providedIn: 'root' })
export class AgendamientoService {

  private API = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getTutores() {
    return this.http.get<any[]>(`${this.API}/tutores`);
  }

  validarDisponibilidad(tutorId: number, fechaHora: string) {
    return this.http.get(`${this.API}/tutorias/disponibilidad`, {
      params: { tutorId, fechaHora }
    });
  }

  agendarTutoria(data: any) {
    return this.http.post(`${this.API}/tutorias/agendar`, data);
  }
}
