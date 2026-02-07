// src/app/core/services/historial.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';


export interface Tutoria {
  id: number;
  tutorId: number;
  fecha: string;
  materia: string;
  tema: string;
  descripcion?: string;
  duracion: number;
  cupoMaximo: number;
  modalidad: 'presencial' | 'virtual' | 'hibrida';
  ubicacion?: string;
  estado: 'programada' | 'en_curso' | 'completada' | 'cancelada';
  createdAt?: string;
  updatedAt?: string;
}

export interface HistorialResponse {
  tutorias: Tutoria[];
}

@Injectable({
  providedIn: 'root'
})
export class HistorialService {
  private API = `${environment.apiUrl}/tutorias`;

  constructor(private http: HttpClient) {}

  /**
   * GET /api/tutorias
   * Obtener historial de tutorías (todas las tutorías del tutor/admin)
   */
  getHistorial(filtros?: { materia?: string; estado?: string; q?: string }): Observable<Tutoria[]> {
    let url = this.API;

    if (filtros) {
      const params = new URLSearchParams();
      if (filtros.materia) params.append('materia', filtros.materia);
      if (filtros.estado) params.append('estado', filtros.estado);
      if (filtros.q) params.append('q', filtros.q);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }

    return this.http.get<HistorialResponse>(url).pipe(
      map(response => response.tutorias)
    );
  }

  /**
   * GET /api/tutorias/:id
   * Obtener detalle de una tutoría específica
   */
  getTutoriaById(id: number): Observable<Tutoria> {
    return this.http.get<Tutoria>(`${this.API}/${id}`);
  }

  /**
   * PUT /api/tutorias/:id
   * Actualizar una tutoría
   */
  actualizarTutoria(id: number, data: Partial<Tutoria>): Observable<{ message: string; tutoria: Tutoria }> {
    return this.http.put<{ message: string; tutoria: Tutoria }>(
      `${this.API}/${id}`,
      data
    );
  }

  /**
   * PUT /api/tutorias/:id (con estado: 'cancelada')
   * Cancelar una tutoría
   */
  cancelarTutoria(id: number): Observable<{ message: string; tutoria: Tutoria }> {
    return this.http.put<{ message: string; tutoria: Tutoria }>(
      `${this.API}/${id}`,
      { estado: 'cancelada' }
    );
  }

  /**
   * DELETE /api/tutorias/:id
   * Eliminar una tutoría
   */
  eliminarTutoria(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.API}/${id}`
    );
  }

  /**
   * GET /api/tutorias?estado=X
   * Obtener tutorías filtradas por estado
   */
  getTutoriasPorEstado(estado: string): Observable<Tutoria[]> {
    return this.http.get<HistorialResponse>(
      `${this.API}?estado=${estado}`
    ).pipe(
      map(response => response.tutorias)
    );
  }

  /**
   * GET /api/tutorias?materia=X
   * Obtener tutorías por materia
   */
  getTutoriasPorMateria(materia: string): Observable<Tutoria[]> {
    return this.http.get<HistorialResponse>(
      `${this.API}?materia=${materia}`
    ).pipe(
      map(response => response.tutorias)
    );
  }

  /**
   * GET /api/tutorias (filtradas según necesites)
   * Obtener estadísticas del historial
   * Nota: Este endpoint puede no existir en tu backend actual.
   * Si quieres usarlo, necesitarás crear el endpoint en el backend.
   */
  getEstadisticas(): Observable<any> {
    // Opción 1: Si tienes un endpoint específico de estadísticas
    // return this.http.get<any>(`${this.API}/estadisticas`);

    // Opción 2: Calcular en el frontend basado en todas las tutorías
    return this.getHistorial().pipe(
      map(tutorias => this.calcularEstadisticas(tutorias))
    );
  }

  /**
   * Calcular estadísticas del historial en el frontend
   */
  private calcularEstadisticas(tutorias: Tutoria[]): any {
    const total = tutorias.length;
    const programadas = tutorias.filter(t => t.estado === 'programada').length;
    const enCurso = tutorias.filter(t => t.estado === 'en_curso').length;
    const completadas = tutorias.filter(t => t.estado === 'completada').length;
    const canceladas = tutorias.filter(t => t.estado === 'cancelada').length;

    // Agrupar por materia
    const porMateria = tutorias.reduce((acc: any, t) => {
      acc[t.materia] = (acc[t.materia] || 0) + 1;
      return acc;
    }, {});

    return {
      total,
      programadas,
      enCurso,
      completadas,
      canceladas,
      porMateria,
      tasaCompletado: total > 0 ? ((completadas / total) * 100).toFixed(2) : 0
    };
  }

  /**
   * Métodos auxiliares para cambiar estados específicos
   */

  iniciarTutoria(id: number): Observable<{ message: string; tutoria: Tutoria }> {
    return this.http.put<{ message: string; tutoria: Tutoria }>(
      `${this.API}/${id}`,
      { estado: 'en_curso' }
    );
  }

  completarTutoria(id: number, descripcion?: string): Observable<{ message: string; tutoria: Tutoria }> {
    const data: any = { estado: 'completada' };
    if (descripcion) {
      data.descripcion = descripcion;
    }
    return this.http.put<{ message: string; tutoria: Tutoria }>(
      `${this.API}/${id}`,
      data
    );
  }

  /**
   * Buscar tutorías por texto (tema o materia)
   */
  buscarTutorias(query: string): Observable<Tutoria[]> {
    return this.http.get<HistorialResponse>(
      `${this.API}?q=${encodeURIComponent(query)}`
    ).pipe(
      map(response => response.tutorias)
    );
  }
}
