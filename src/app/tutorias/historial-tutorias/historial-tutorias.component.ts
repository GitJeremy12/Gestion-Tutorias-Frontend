import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TutoriaService } from '../services/tutoria.service';

@Component({
  selector: 'app-historial-tutorias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historial-tutorias.component.html'
})
export class HistorialTutoriasComponent implements OnInit {

  tutorias: any[] = [];
  tutoriasFiltradas: any[] = [];

  materiaFiltro = '';
  seleccionada: any = null;

  constructor(private tutoriaService: TutoriaService) {}

  ngOnInit(): void {
    this.cargarHistorial();
  }

  cargarHistorial() {
    this.tutoriaService.getHistorial().subscribe({
      next: res => {
        // ordenar por fecha descendente
        this.tutorias = res.sort(
          (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        );
        this.tutoriasFiltradas = this.tutorias;
      }
    });
  }

  filtrar() {
    if (!this.materiaFiltro) {
      this.tutoriasFiltradas = this.tutorias;
      return;
    }

    this.tutoriasFiltradas = this.tutorias.filter(t =>
      t.materia.toLowerCase().includes(this.materiaFiltro.toLowerCase())
    );
  }

  verDetalle(t: any) {
    this.seleccionada = t;
  }

  cerrarDetalle() {
    this.seleccionada = null;
  }
}
