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
   * Obtener tutorías (para historial)
   */
  getTutorias(): Observable<any[]> {
    // return this.http.get<any[]>(`${this.apiUrl}/tutorias`);
    return of([]).pipe(delay(300));
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
 * Obtener tutoría por ID (precargar formulario)
 */
getTutoriaById(id: number): Observable<any> {
  console.log('📥 Cargando tutoría:', id);

  // MOCK
  return of({
    id,
    estudiante: 'María García',
    fecha: new Date(),
    materia: 'Matemáticas',
    tema: 'Integrales',
    observaciones: 'Sesión productiva',
    duracion: 60
  }).pipe(delay(500));

  // REAL:
  // return this.http.get<any>(`${this.apiUrl}/tutorias/${id}`);
  }

}
