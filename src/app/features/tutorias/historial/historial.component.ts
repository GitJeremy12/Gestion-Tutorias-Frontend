import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HistorialService } from '../../../core/services/historial.service';

@Component({
  standalone: true,
  selector: 'app-historial',
  imports: [CommonModule, FormsModule],
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent implements OnInit {

  tutorias: any[] = [];
  tutoriasFiltradas: any[] = [];
  materias: string[] = [];

  materiaFiltro = '';
  seleccionada: any = null;

  constructor(private historialService: HistorialService) {}

  ngOnInit() {
    this.cargarHistorial();
  }

  cargarHistorial() {
    this.historialService.getHistorial().subscribe({
      next: data => {
        // Orden descendente por fecha
        this.tutorias = data.sort(
          (a, b) => new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime()
        );
        this.tutoriasFiltradas = [...this.tutorias];
        this.materias = [...new Set(this.tutorias.map(t => t.materia))];
      }
    });
  }

  filtrarPorMateria() {
    if (!this.materiaFiltro) {
      this.tutoriasFiltradas = [...this.tutorias];
      return;
    }

    this.tutoriasFiltradas = this.tutorias.filter(
      t => t.materia === this.materiaFiltro
    );
  }

  verDetalle(tutoria: any) {
    this.seleccionada = tutoria;
  }

  cerrarDetalle() {
    this.seleccionada = null;
  }
}
