import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-dashboard-estudiante',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-estudiante.component.html',
  styleUrls: ['./dashboard-estudiante.component.css']
})
export class DashboardEstudianteComponent {}
