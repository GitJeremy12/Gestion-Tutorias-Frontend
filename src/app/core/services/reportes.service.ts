import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('❌ Token no encontrado');
      return new HttpHeaders();
    }

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // =========================
  // 📘 REPORTE ESTUDIANTE
  // =========================
  // 👈 BACKEND EXIGE :estudianteId
  getReporteEstudiante(estudianteId: number): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/reportes/estudiante/${estudianteId}`,
      { headers: this.getHeaders() }
    );
  }

  // =========================
  // 👨‍🏫 REPORTE TUTOR
  // =========================
  getReporteTutor(tutorId: number): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/reportes/tutor/${tutorId}`,
      { headers: this.getHeaders() }
    );
  }

  // =========================
  // 📅 REPORTE SEMANAL (ADMIN)
  // =========================
  getReporteSemanal(from?: string, to?: string): Observable<any> {
    let params = new HttpParams();

    if (from && to) {
      params = params.set('from', from).set('to', to);
    }

    return this.http.get(
      `${this.apiUrl}/reportes/semanal`,
      { headers: this.getHeaders(), params }
    );
  }

  // =========================
  // 📄 EXPORTAR PDF
  // =========================
  exportarPDF(
    tipo: 'estudiante' | 'tutor' | 'semanal',
    id?: number,
    from?: string,
    to?: string
  ) {
    let params = new HttpParams().set('tipo', tipo);

    if (id) params = params.set('id', id.toString());
    if (from && to) {
      params = params.set('from', from).set('to', to);
    }

    return this.http.get(
      `${this.apiUrl}/reportes/pdf`,
      {
        headers: this.getHeaders(),
        params,
        responseType: 'blob'
      }
    );
  }
}
