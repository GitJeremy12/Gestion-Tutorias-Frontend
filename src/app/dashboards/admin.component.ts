import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Panel de Administración</h2>
    <p>Bienvenido, administrador.</p>
  `
})
export class AdminComponent {}
