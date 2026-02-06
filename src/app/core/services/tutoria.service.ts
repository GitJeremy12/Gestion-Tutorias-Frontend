import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TutoriaService {
  private apiUrl = 'http://localhost:3000/api';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  /**
   * Obtener lista de estudiantes
   */
  getEstudiantes(): Observable<any[]> {
    // Cuando tengas backend:
    // return this.http.get<any[]>(`${this.apiUrl}/estudiantes`);

    // TEMPORAL: Datos de prueba
    return of([
      {
        id: 1,
        nombre: 'María García López',
        carrera: 'Ingeniería en Sistemas',
        semestre: 5,
        matricula: '2021001234',
        email: 'maria.garcia@ejemplo.com',
        telefono: '+52 123 456 7890'
      },
      {
        id: 2,
        nombre: 'Juan Pérez Martínez',
        carrera: 'Ingeniería Civil',
        semestre: 3,
        matricula: '2022005678',
        email: 'juan.perez@ejemplo.com'
      },
      {
        id: 3,
        nombre: 'Ana Rodríguez Sánchez',
        carrera: 'Arquitectura',
        semestre: 7,
        matricula: '2020009012',
        email: 'ana.rodriguez@ejemplo.com',
        telefono: '+52 098 765 4321'
      },
      {
        id: 4,
        nombre: 'Carlos Hernández Gómez',
        carrera: 'Ingeniería Industrial',
        semestre: 4,
        matricula: '2021003456',
        email: 'carlos.hernandez@ejemplo.com'
      },
      {
        id: 5,
        nombre: 'Laura Martínez Silva',
        carrera: 'Ingeniería en Sistemas',
        semestre: 6,
        matricula: '2020007890',
        email: 'laura.martinez@ejemplo.com'
      }
    ]).pipe(delay(500));
  }

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
          nombre: 'Dr. María González',
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
   * Registrar nueva tutoría
   * @param data Datos de la tutoría
   */
  registrarTutoria(data: any): Observable<any> {
    console.log('📝 Registrando tutoría:', data);

    // TEMPORAL: Simula guardado exitoso
    return of({
      success: true,
      message: 'Tutoría registrada exitosamente',
      id: Math.floor(Math.random() * 1000),
      tutoria: {
        ...data,
        estado: 'registrada',
        createdAt: new Date().toISOString()
      }
    }).pipe(delay(1000));

    // Cuando tengas backend, reemplaza con:
    // return this.http.post(`${this.apiUrl}/tutorias`, data, this.httpOptions);
  }

  /**
   * Obtener tutorías (para historial - todas)
   */
  getTutorias(): Observable<any[]> {
    // Cuando tengas backend:
    // return this.http.get<any[]>(`${this.apiUrl}/tutorias`);

    return of([]).pipe(delay(300));
  }

  /**
   * Obtener tutoría por ID (precargar formulario)
   */
  getTutoriaById(id: number): Observable<any> {
    console.log('📥 Cargando tutoría:', id);

    // TEMPORAL
    return of({
      id,
      estudianteId: 1,
      estudiante: 'María García',
      fechaHora: new Date().toISOString(),
      materia: 'Matemáticas',
      tema: 'Integrales',
      observaciones: 'Sesión productiva',
      duracion: 60
    }).pipe(delay(500));

    // Cuando tengas backend:
    // return this.http.get<any>(`${this.apiUrl}/tutorias/${id}`);
  }

  /**
   * Actualizar tutoría existente
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
    // return this.http.put(`${this.apiUrl}/tutorias/${id}`, data, this.httpOptions);
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
   * Confirmar asistencia a tutoría
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
}
