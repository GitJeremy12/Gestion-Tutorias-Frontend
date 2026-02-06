// cancel-modal.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TutoriasService } from '../../../core/services/tutorias.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-cancel-modal',
  templateUrl: './cancel-modal.component.html',
  styleUrls: ['./cancel-modal.component.css']
})
export class CancelModalComponent {
  @Input() tutoria: any;
  @Output() cancelada = new EventEmitter<void>();
  @Output() cerrar = new EventEmitter<void>();

  loading = false;
  error = '';

  constructor(private tutoriasService: TutoriasService) {}

  confirmar() {
    this.loading = true;
    this.error = '';

    this.tutoriasService.cancelarTutoria(this.tutoria.id).subscribe({
      next: () => {
        this.loading = false;
        this.cancelada.emit();
      },
      error: (err: any) => {
        this.loading = false;
        this.error = 'Error al cancelar la tutoría. Por favor, intenta de nuevo.';
        console.error('Error al cancelar:', err);

        // Mostrar error en alert (puedes mejorarlo con un toast)
        alert(this.error);
      }
    });
  }

  // Cerrar con ESC key
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape' && !this.loading) {
      this.cerrar.emit();
    }
  }
}
