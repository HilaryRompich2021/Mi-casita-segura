import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-guardia-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './guardia-sidebar.component.html',
  styleUrl: './guardia-sidebar.component.css'
})

export class GuardiaSidebarComponent {
  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

//Cerrar sesión
  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}

