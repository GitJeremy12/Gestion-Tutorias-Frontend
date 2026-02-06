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
        },
        estudiante: {
          id: 1,
          nombre: 'María García López',
          email: 'maria.garcia@ejemplo.com'
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
          especialidad: 'Física',
          departamento: 'Ciencias Exactas'
        },
        estudiante: {
          id: 2,
          nombre: 'Juan Pérez Martínez',
          email: 'juan.perez@ejemplo.com'
        }
      },
      {
        id: 3,
        fecha: '2026-02-20T16:00:00',
        materia: 'Programación',
        tema: 'Angular Avanzado - Servicios',
        estado: 'confirmada',
        duracion: 120,
        tutor: {
          id: 3,
          nombre: 'Ing. Carlos Ruiz',
          especialidad: 'Desarrollo Web',
          departamento: 'Ingeniería'
        },
        estudiante: {
          id: 3,
          nombre: 'Ana Rodríguez Sánchez',
          email: 'ana.rodriguez@ejemplo.com'
        }
      },
      {
        id: 4,
        fecha: '2026-03-01T09:00:00',
        materia: 'Química',
        tema: 'Reacciones orgánicas',
        estado: 'agendada',
        duracion: 60,
        tutor: {
          id: 4,
          nombre: 'Dra. María González',
          especialidad: 'Química Orgánica',
          departamento: 'Ciencias Químicas'
        },
        estudiante: {
          id: 4,
          nombre: 'Carlos Hernández Gómez',
          email: 'carlos.hernandez@ejemplo.com'
        }
      },
      {
        id: 5,
        fecha: '2026-02-07T11:00:00',
        materia: 'Estadística',
        tema: 'Probabilidad y Distribuciones',
        estado: 'agendada',
        duracion: 60,
        tutor: {
          id: 5,
          nombre: 'Dr. Roberto Sánchez',
          especialidad: 'Estadística',
          departamento: 'Matemáticas Aplicadas'
        },
        estudiante: {
          id: 5,
          nombre: 'Laura Martínez Silva',
          email: 'laura.martinez@ejemplo.com'
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

  /**
   * Obtener tutoría por ID
   * @param id ID de la tutoría
   */
  getTutoriaById(id: number): Observable<any> {
    console.log('📥 Cargando tutoría:', id);

    // TEMPORAL
    return of({
      id,
      fecha: '2026-02-15T10:00:00',
      materia: 'Matemáticas',
      tema: 'Cálculo Diferencial',
      estado: 'agendada',
      duracion: 60,
      observaciones: 'Sesión importante',
      tutor: {
        id: 1,
        nombre: 'Dr. Juan Pérez',
        especialidad: 'Matemáticas'
      }
    }).pipe(delay(300));

    // Cuando tengas backend:
    // return this.http.get<any>(`${this.apiUrl}/tutorias/${id}`);
  }

  /**
   * Actualizar tutoría
   * @param id ID de la tutoría
   * @param data Datos actualizados
   */
  actualizarTutoria(id: number, data: any): Observable<any> {
    console.log('🔄 Actualizando tutoría:', id, data);

    // TEMPORAL
    return of({
      success: true,
      message: 'Tutoría actualizada exitosamente',
      id
    }).pipe(delay(800));

    // Cuando tengas backend:
    // return this.http.put(
    //   `${this.apiUrl}/tutorias/${id}`,
    //   data,
    //   this.httpOptions
    // );
  }

  /**
   * Confirmar asistencia
   * @param id ID de la tutoría
   */
  confirmarAsistencia(id: number): Observable<any> {
    console.log('✓ Confirmando asistencia:', id);

    // TEMPORAL
    return of({
      success: true,
      message: 'Asistencia confirmada'
    }).pipe(delay(500));

    // Cuando tengas backend:
    // return this.http.patch(
    //   `${this.apiUrl}/tutorias/${id}/confirmar`,
    //   {},
    //   this.httpOptions
    // );
  }

  /**
   * Obtener todas las tutorías
   */
  getTutorias(): Observable<any[]> {
    // Cuando tengas backend:
    // return this.http.get<any[]>(`${this.apiUrl}/tutorias`);

    return of([]).pipe(delay(300));
  }

  /**
   * Obtener tutorías por estado
   * @param estado Estado de la tutoría
   */
  getTutoriasPorEstado(estado: string): Observable<any[]> {
    console.log('🔍 Filtrando por estado:', estado);

    // Cuando tengas backend:
    // return this.http.get<any[]>(`${this.apiUrl}/tutorias/estado/${estado}`);

    return of([]).pipe(delay(300));
  }

  /**
   * Eliminar tutoría
   * @param id ID de la tutoría
   */
  eliminarTutoria(id: number): Observable<any> {
    console.log('🗑️ Eliminando tutoría:', id);

    // TEMPORAL
    return of({
      success: true,
      message: 'Tutoría eliminada exitosamente'
    }).pipe(delay(500));

    // Cuando tengas backend:
    // return this.http.delete(`${this.apiUrl}/tutorias/${id}`);
  }
}
