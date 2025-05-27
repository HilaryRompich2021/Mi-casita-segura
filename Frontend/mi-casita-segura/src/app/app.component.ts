import { Component, OnInit } from '@angular/core';
<<<<<<< HEAD
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { filter } from 'rxjs/operators';
import { HeaderComponent }              from './shared/ui/header/header.component';
import { SidebarComponent }             from './shared/sidebar/sidebar.component';
import { ResidenteSidebarComponent }    from './shared/sidebar/residente-sidebar/residente-sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NgIf,
    HeaderComponent,
    SidebarComponent,
    ResidenteSidebarComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
=======
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import SidebarComponent from './shared/Menu_Lateral/administrador-sidebar/sidebar.component';
import { filter } from 'rxjs';
import ResidenteSidebarComponent from './shared/Menu_Lateral/residente-sidebar/residente-sidebar.component';
@Component({
  selector: 'app-root',
  standalone: true,
imports: [RouterOutlet, CommonModule, SidebarComponent, ResidenteSidebarComponent], // 🔧 ¡Sidebar removido aquí!
templateUrl: './app.component.html',
styleUrls: ['./app.component.css']

>>>>>>> 9907a2ef3b793537e9cea53f75801e1441bc5579
})
export class AppComponent implements OnInit {
  showSidebar = false;
  rol = '';

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
<<<<<<< HEAD
        this.updateRoleFromToken();
        this.showSidebar = !this.router.url.startsWith('/auth');
      });
  }
=======
        this.updateRoleFromToken(); // Usa solo esta función
        this.showSidebar = !this.router.url.startsWith('/auth');
      });
  }

>>>>>>> 9907a2ef3b793537e9cea53f75801e1441bc5579

  ngOnInit(): void {
    this.updateRoleFromToken();
  }

  private updateRoleFromToken(): void {
    const token = localStorage.getItem('auth_token');
    if (!token) { this.rol = ''; return; }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.rol = payload.roles?.[0] || '';
    } catch {
      this.rol = '';
    }
  }
}
