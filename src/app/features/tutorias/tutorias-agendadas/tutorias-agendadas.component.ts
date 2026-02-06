// tutorias-agendadas.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TutoriasService } from '../../../core/services/tutorias.service';
import { CancelModalComponent } from '../cancel-modal/cancel-modal.component';

@Component({
  standalone: true,
  imports: [CommonModule, CancelModalComponent],
  selector: 'app-tutorias-agendadas',
  templateUrl: './tutorias-agendadas.component.html'
})
export class TutoriasAgendadasComponent implements OnInit {

  tutorias: any[] = [];
  selectedTutoria: any = null;

  constructor(private tutoriasService: TutoriasService) {}

  ngOnInit() {
    this.cargarTutorias();
  }

  cargarTutorias() {
    this.tutoriasService.getAgendadas().subscribe({
      next: data => this.tutorias = data
    });
  }

  abrirModal(tutoria: any) {
    this.selectedTutoria = tutoria;
  }

  onCancelada() {
    this.selectedTutoria = null;
    this.cargarTutorias();
    alert('Tutoría cancelada exitosamente');
  }
}
