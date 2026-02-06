import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TutoriaService } from '../../../core/services/tutoria.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-editar-tutoria',
  templateUrl: './editar-tutoria.component.html'
})
export class EditarTutoriaComponent implements OnInit {

  tutoriaId!: number;
  form: any = {};
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tutoriaService: TutoriaService
  ) {}

  ngOnInit() {
    this.tutoriaId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarTutoria();
  }

  cargarTutoria() {
    this.tutoriaService.getTutoriaById(this.tutoriaId).subscribe({
      next: data => this.form = data
    });
  }

  guardar() {
    this.loading = true;

    this.tutoriaService.actualizarTutoria(this.tutoriaId, this.form).subscribe({
      next: () => {
        alert('Tutoría actualizada exitosamente');
        this.router.navigate(['/historial']);
      },
      error: () => {
        alert('Error al actualizar tutoría');
        this.loading = false;
      }
    });
  }
}
