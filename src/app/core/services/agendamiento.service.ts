import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AgendamientoService {

  private API = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ✅ SOLO tutorías disponibles para estudiantes
  getTutoriasDisponibles() {
    return this.http.get<any>(`${this.API}/tutorias/disponibles`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  // ✅ Inscribirse (el backend obtiene el estudiante desde el token)
  inscribirse(tutoriaId: number) {
    return this.http.post(
      `${this.API}/inscripciones`,
      { tutoriaId },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
  }
}
