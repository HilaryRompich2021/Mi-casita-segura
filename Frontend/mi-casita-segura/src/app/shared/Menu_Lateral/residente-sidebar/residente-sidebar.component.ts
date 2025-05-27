import { CommonModule, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-residente-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './residente-sidebar.component.html',
  styleUrl: './residente-sidebar.component.css'
})
export class ResidenteSidebarComponent {

}
