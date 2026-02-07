// src/app/core/services/tutoria.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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

export interface CrearTutoriaRequest {
  tutorId: number;
  fecha: string;
  materia: string;
  tema: string;
  descripcion?: string;
  duracion: number;
  cupoMaximo?: number;
  modalidad?: 'presencial' | 'virtual' | 'hibrida';
  ubicacion?: string;
  estado?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TutoriaService {
  private API = `${environment.apiUrl}/tutorias`;

  constructor(private http: HttpClient) {}

  /**
   * GET /api/tutorias
   * Obtener todas las tutorías (con filtros opcionales)
   */
  getTutorias(filtros?: { materia?: string; estado?: string; q?: string }): Observable<{ tutorias: Tutoria[] }> {
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

    return this.http.get<{ tutorias: Tutoria[] }>(url);
  }

  /**
   * POST /api/tutorias
   * Crear nueva tutoría
   */
  registrarTutoria(data: CrearTutoriaRequest): Observable<{ message: string; tutoria: Tutoria }> {
    console.log('📝 Registrando tutoría:', data);
    return this.http.post<{ message: string; tutoria: Tutoria }>(this.API, data);
  }

  /**
   * GET /api/tutorias/:id
   * Obtener tutoría por ID
   */
  getTutoriaById(id: number): Observable<Tutoria> {
    console.log('📥 Cargando tutoría:', id);
    return this.http.get<Tutoria>(`${this.API}/${id}`);
  }

  /**
   * PUT /api/tutorias/:id
   * Actualizar tutoría existente
   */
  actualizarTutoria(id: number, data: Partial<CrearTutoriaRequest>): Observable<{ message: string; tutoria: Tutoria }> {
    console.log('🔄 Actualizando tutoría:', id, data);
    return this.http.put<{ message: string; tutoria: Tutoria }>(`${this.API}/${id}`, data);
  }

  /**
   * DELETE /api/tutorias/:id
   * Eliminar tutoría
   */
  eliminarTutoria(id: number): Observable<{ message: string }> {
    console.log('🗑️ Eliminando tutoría:', id);
    return this.http.delete<{ message: string }>(`${this.API}/${id}`);
  }

  /**
   * PATCH /api/tutorias/:id
   * Cancelar tutoría (actualizar estado a 'cancelada')
   */
  cancelarTutoria(id: number): Observable<{ message: string; tutoria: Tutoria }> {
    console.log('🚫 Cancelando tutoría:', id);
    return this.http.put<{ message: string; tutoria: Tutoria }>(
      `${this.API}/${id}`,
      { estado: 'cancelada' }
    );
  }

  /**
   * Obtener tutorías agendadas (programadas y futuras)
   */
  getAgendadas(): Observable<{ tutorias: Tutoria[] }> {
    return this.http.get<{ tutorias: Tutoria[] }>(
      `${this.API}?estado=programada`
    );
  }

  /**
   * Obtener tutorías por estado
   */
  getTutoriasPorEstado(estado: string): Observable<{ tutorias: Tutoria[] }> {
    console.log('🔍 Filtrando por estado:', estado);
    return this.http.get<{ tutorias: Tutoria[] }>(
      `${this.API}?estado=${estado}`
    );
  }

  /**
   * Confirmar que la tutoría está en curso
   */
  iniciarTutoria(id: number): Observable<{ message: string; tutoria: Tutoria }> {
    console.log('▶️ Iniciando tutoría:', id);
    return this.http.put<{ message: string; tutoria: Tutoria }>(
      `${this.API}/${id}`,
      { estado: 'en_curso' }
    );
  }

  /**
   * Marcar tutoría como completada
   */
  completarTutoria(id: number, descripcion?: string): Observable<{ message: string; tutoria: Tutoria }> {
    console.log('✅ Completando tutoría:', id);
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
   * Obtener estudiantes (si tienes este endpoint)
   * Si no existe, quita este método
   */
  getEstudiantes(): Observable<any[]> {
    // Si tienes un endpoint de estudiantes:
    return this.http.get<any[]>(`${environment.apiUrl}/estudiantes`);

    // Si no, puedes dejarlo comentado o eliminar el método
  }
}
