import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/ui/header/header.component';
import { CommonModule } from '@angular/common';
import SidebarComponent from './shared/sidebar/sidebar.component';
import { filter } from 'rxjs';
import HomeComponent from './home/home.component';
import ResidenteSidebarComponent from './shared/sidebar/residente-sidebar/residente-sidebar.component';
//import ResidenteSidebarComponent from "./shared/sidebar/residente-sidebar/residente-sidebar.component";
//import { SidebarComponent } from "./shared/sidebar/sidebar.component";

@Component({
  selector: 'app-root',
  standalone: true,
imports: [RouterOutlet, CommonModule, HeaderComponent, SidebarComponent, ResidenteSidebarComponent], // 🔧 ¡Sidebar removido aquí!
templateUrl: './app.component.html',
styleUrls: ['./app.component.css']

/* template: `
    <app-header></app-header>
    <div class="h-screen flex">
      <ng-container *ngIf="showSidebar">
        <app-sidebar *ngIf="rol === 'ADMINISTRADOR'"></app-sidebar>
        <app-residente-sidebar *ngIf="rol === 'RESIDENTE'"></app-residente-sidebar>
      </ng-container>
      <div class="flex-1 overflow-auto">
        <router-outlet></router-outlet>
      </div>
    </div>
  `*/
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
   /* this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateRoleFromToken();
        this.showSidebar = !this.router.url.startsWith('/auth');
      });
  }*/


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
