import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export default class SidebarComponent {
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
