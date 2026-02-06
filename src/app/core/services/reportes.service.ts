// src/app/core/services/reportes.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReportesService {

  private API = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // HU-05: lista de estudiantes
  getEstudiantes() {
    return this.http.get<any[]>(`${this.API}/estudiantes`);
  }

  // HU-05: reporte por estudiante
  generarReporte(estudianteId: number, desde?: string, hasta?: string) {
    let params = new HttpParams();
    if (desde) params = params.set('desde', desde);
    if (hasta) params = params.set('hasta', hasta);

    return this.http.get<any[]>(
      `${this.API}/reportes/estudiante/${estudianteId}`,
      { params }
    );
  }

  // ✅ HU-06: reporte semanal
  getReporteSemanal(semana: string) {
    return this.http.get<any>(
      `${this.API}/reportes/semanal`,
      {
        params: { semana }
      }
    );
  }
}
