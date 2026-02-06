// src/app/core/services/historial.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';


@Injectable({ providedIn: 'root' })
export class HistorialService {

  private API = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getHistorial() {
    return this.http.get<any[]>(`${this.API}/tutorias/historial`);
  }
}
