// src/app/core/services/tutorias.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TutoriasService {
  private apiUrl = 'http://localhost:3000/api';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  /**
   * Obtener tutorías agendadas (futuras)
   */
  getAgendadas(): Observable<any[]> {
    // Cuando tengas backend:
    // return this.http.get<any[]>(`${this.apiUrl}/tutorias/agendadas`);

    // TEMPORAL: Datos de prueba
    return of([
      {
        id: 1,
        fecha: '2026-02-15T10:00:00',
        materia: 'Matemáticas',
        tema: 'Cálculo Diferencial - Derivadas',
        estado: 'agendada',
        duracion: 60,
        tutor: {
          id: 1,
          nombre: 'Dr. Juan Pérez',
          especialidad: 'Matemáticas',
          departamento: 'Ciencias Exactas'
        }
      },
      {
        id: 2,
        fecha: '2026-02-08T14:00:00',
        materia: 'Física',
        tema: 'Mecánica Cuántica',
        estado: 'agendada',
        duracion: 90,
        tutor: {
          id: 2,
          nombre: 'Dra. Ana López',
          especialidad: 'Física'
        }
      }
    ]).pipe(delay(500));
  }

  /**
   * Cancelar tutoría
   * @param id ID de la tutoría
   */
  cancelarTutoria(id: number): Observable<any> {
    console.log('🚫 Cancelando tutoría:', id);

    // TEMPORAL
    return of({
      success: true,
      message: 'Tutoría cancelada exitosamente'
    }).pipe(delay(800));

    // Cuando tengas backend:
    // return this.http.patch(
    //   `${this.apiUrl}/tutorias/${id}`,
    //   { estado: 'cancelada' },
    //   this.httpOptions
    // );
  }
}
