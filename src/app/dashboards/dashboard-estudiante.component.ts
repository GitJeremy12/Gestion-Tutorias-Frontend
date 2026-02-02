import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-estudiante',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Dashboard Estudiante</h2>
    <p>Bienvenido al panel del estudiante.</p>
  `
})
export class DashboardEstudianteComponent {}
