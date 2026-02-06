// cancel-modal.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TutoriasService } from '../../../core/services/tutorias.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-cancel-modal',
  templateUrl: './cancel-modal.component.html'
})
export class CancelModalComponent {

  @Input() tutoria: any;
  @Output() cancelada = new EventEmitter<void>();
  @Output() cerrar = new EventEmitter<void>();

  loading = false;

  constructor(private tutoriasService: TutoriasService) {}

  confirmar() {
    this.loading = true;
    this.tutoriasService.cancelarTutoria(this.tutoria.id).subscribe({
      next: () => this.cancelada.emit(),
      error: () => {
        alert('Error al cancelar la tutoría');
        this.loading = false;
      }
    });
  }
}
