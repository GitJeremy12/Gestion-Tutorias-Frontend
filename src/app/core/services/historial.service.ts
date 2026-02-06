// src/app/core/services/historial.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HistorialService {
  private API = environment.apiUrl;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  /**
   * Obtener historial de tutorías
   */
  getHistorial(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API}/tutorias/historial`);
  }

  /**
   * Cancelar una tutoría
   * @param id ID de la tutoría a cancelar
   */
  cancelarTutoria(id: number): Observable<any> {
    return this.http.patch(
      `${this.API}/tutorias/${id}`,
      { estado: 'cancelada' },
      this.httpOptions
    );
  }

  /**
   * Obtener detalle de una tutoría específica
   * @param id ID de la tutoría
   */
  getTutoriaById(id: number): Observable<any> {
    return this.http.get<any>(`${this.API}/tutorias/${id}`);
  }

  /**
   * Actualizar una tutoría
   * @param id ID de la tutoría
   * @param data Datos a actualizar
   */
  actualizarTutoria(id: number, data: any): Observable<any> {
    return this.http.put(
      `${this.API}/tutorias/${id}`,
      data,
      this.httpOptions
    );
  }

  /**
   * Obtener tutorías filtradas por estado
   * @param estado Estado de la tutoría (pendiente, completada, cancelada)
   */
  getTutoriasPorEstado(estado: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.API}/tutorias/estado/${estado}`);
  }

  /**
   * Obtener tutorías por materia
   * @param materia Nombre de la materia
   */
  getTutoriasPorMateria(materia: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.API}/tutorias/materia/${materia}`);
  }

  /**
   * Obtener estadísticas del historial
   */
  getEstadisticas(): Observable<any> {
    return this.http.get<any>(`${this.API}/tutorias/estadisticas`);
  }
}
