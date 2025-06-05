import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import SidebarComponent from './shared/Menu_Lateral/administrador-sidebar/sidebar.component';
import { filter } from 'rxjs';
import { ResidenteSidebarComponent } from './shared/Menu_Lateral/residente-sidebar/residente-sidebar.component';
import { GuardiaSidebarComponent } from "./shared/Menu_Lateral/guardia-sidebar/guardia-sidebar.component";

@Component({
  selector: 'app-root',
  standalone: true,
imports: [RouterOutlet, CommonModule, SidebarComponent, ResidenteSidebarComponent, GuardiaSidebarComponent],
templateUrl: './app.component.html',
styleUrls: ['./app.component.css']

})
export class AppComponent implements OnInit {
  showSidebar = false;
  rol: string = '';


  constructor(private router: Router) {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        this.updateRoleFromToken(); // Usa solo esta función
        this.showSidebar = !this.router.url.startsWith('/auth');
      });
  }


  ngOnInit(): void {
    this.updateRoleFromToken();
  }

  private updateRoleFromToken(): void {
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.rol = payload.roles?.[0] || '';
      } catch (error) {
        console.warn('Token inválido o malformado.');
        this.rol = '';
      }
    } else {
      this.rol = '';
    }
  }
}
