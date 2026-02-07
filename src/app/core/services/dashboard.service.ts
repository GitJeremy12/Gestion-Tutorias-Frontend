import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  /**
   * Obtener usuario actual del localStorage o sesión
   */
  getUsuarioActual(): any {
    // Esto debería venir de tu servicio de autenticación
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  }

  /**
   * Estadísticas para Administrador
   */
  getEstadisticasAdmin(): Observable<any> {
    // Cuando tengas backend:
    // return this.http.get(`${this.apiUrl}/dashboard/admin`);

    // TEMPORAL
    return of({
      totalTutorias: 245,
      totalEstudiantes: 85,
      totalTutores: 12,
      tutoriasHoy: 8
    }).pipe(delay(500));
  }

  /**
   * Actividad reciente
   */
  getActividadReciente(): Observable<any[]> {
    // return this.http.get<any[]>(`${this.apiUrl}/dashboard/actividad`);

    // TEMPORAL
    return of([
      {
        icono: '✅',
        texto: 'Nueva tutoría registrada: Matemáticas - Juan Pérez',
        tiempo: 'Hace 5 minutos'
      },
      {
        icono: '📅',
        texto: 'Tutoría agendada: Física - María García',
        tiempo: 'Hace 15 minutos'
      },
      {
        icono: '👤',
        texto: 'Nuevo estudiante registrado: Carlos López',
        tiempo: 'Hace 1 hora'
      },
      {
        icono: '📊',
        texto: 'Reporte semanal generado',
        tiempo: 'Hace 2 horas'
      }
    ]).pipe(delay(300));
  }

  /**
   * Estadísticas para Estudiante
   */
  getEstadisticasEstudiante(): Observable<any> {
    // return this.http.get(`${this.apiUrl}/dashboard/estudiante`);

    // TEMPORAL
    return of({
      totalTutorias: 15,
      completadas: 12,
      agendadas: 3,
      horasTotales: 22
    }).pipe(delay(500));
  }

  /**
   * Próximas tutorías del estudiante
   */
  getProximasTutorias(): Observable<any[]> {
    // return this.http.get<any[]>(`${this.apiUrl}/dashboard/proximas-tutorias`);

    // TEMPORAL
    return of([
      {
        fecha: '2026-02-08T10:00:00',
        materia: 'Matemáticas',
        tutor: 'Dr. Juan Pérez'
      },
      {
        fecha: '2026-02-10T14:00:00',
        materia: 'Física',
        tutor: 'Dra. Ana López'
      },
      {
        fecha: '2026-02-12T16:00:00',
        materia: 'Programación',
        tutor: 'Ing. Carlos Ruiz'
      }
    ]).pipe(delay(400));
  }

  /**
   * Estadísticas para Tutor
   */
  getEstadisticasTutor(): Observable<any> {
    // return this.http.get(`${this.apiUrl}/dashboard/tutor`);

    // TEMPORAL
    return of({
      totalTutorias: 48,
      estudiantesAtendidos: 25,
      tutoriasHoy: 4,
      horasImpartidas: 72
    }).pipe(delay(500));
  }

  /**
   * Agenda del día para Tutor
   */
  getAgendaHoy(): Observable<any[]> {
    // return this.http.get<any[]>(`${this.apiUrl}/dashboard/agenda-hoy`);

    // TEMPORAL
    return of([
      {
        hora: '10:00',
        materia: 'Matemáticas',
        estudiante: 'María García',
        tema: 'Derivadas',
        estado: 'confirmada'
      },
      {
        hora: '12:00',
        materia: 'Física',
        estudiante: 'Juan Pérez',
        tema: 'Cinemática',
        estado: 'pendiente'
      },
      {
        hora: '14:00',
        materia: 'Matemáticas',
        estudiante: 'Ana Rodríguez',
        tema: 'Integrales',
        estado: 'confirmada'
      },
      {
        hora: '16:00',
        materia: 'Estadística',
        estudiante: 'Carlos López',
        tema: 'Probabilidad',
        estado: 'pendiente'
      }
    ]).pipe(delay(400));
  }
}
