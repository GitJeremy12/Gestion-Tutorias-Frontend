import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";

@Injectable({ providedIn: 'root' })
export class TutoriaService {

  private API_URL = '/api'; // base (usa proxy o interceptor)

  constructor(private http: HttpClient) {}

  // =========================
  // HU-01 → Registrar tutoría completada (Tutor)
  // =========================
  registrarTutoria(data: any): Observable<any> {
    return this.http.post(`${this.API_URL}/tutorias`, data);
  }

  obtenerEstudiantes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/estudiantes`);

    // 🔹 MOCK TEMPORAL (solo si el backend no está listo)
    /*
    return of([
      { id: 1, nombre: 'Juan Pérez' },
      { id: 2, nombre: 'María López' }
    ]);
    */
  }

  // =========================
  // HU-02 → Agendar tutoría futura (Estudiante)
  // =========================
  getTutores(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/tutores`);
  }

  validarDisponibilidad(data: {
    tutor_id?: string | null;
    fecha?: string | null;
    hora?: string | null;
  }): Observable<any> {
    return this.http.post(`${this.API_URL}/tutorias/validar`, data);
  }

  agendarTutoria(data: {
    tutor_id?: string | null;
    fecha?: string | null;
    hora?: string | null;
    materia?: string | null;
    tema?: string | null;
  }): Observable<any> {
    return this.http.post(`${this.API_URL}/tutorias/agendar`, data);
  }
  // HU-04: Historial
getHistorial(params?: any) {
  return this.http.get<any[]>(`${this.API_URL}/tutorias/historial`, {
    params
  });
}
}
