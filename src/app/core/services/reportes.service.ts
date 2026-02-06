// src/app/core/services/reportes.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReportesService {

  private API = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getEstudiantes() {
    return this.http.get<any[]>(`${this.API}/estudiantes`);
  }

  generarReporte(estudianteId: number, desde?: string, hasta?: string) {
    const params: any = {};
    if (desde) params.desde = desde;
    if (hasta) params.hasta = hasta;

    return this.http.get<any[]>(
      `${this.API}/reportes/estudiante/${estudianteId}`,
      { params }
    );
  }
}
