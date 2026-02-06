import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-dashboard-tutor',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-tutor.component.html',
  styleUrls: ['./dashboard-tutor.component.css']
})
export class DashboardTutorComponent {}
