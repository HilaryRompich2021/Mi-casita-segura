import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/ui/header/header.component';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './shared/ui/header/header.component';
import SidebarComponent from './shared/sidebar/sidebar.component';
import { Subscription } from 'rxjs';
import { WebSocketService } from './services/web-socket.service';
import { filter } from 'rxjs';
import HomeComponent from './home/home.component';
import ResidenteSidebarComponent from './shared/sidebar/residente-sidebar/residente-sidebar.component';
//import ResidenteSidebarComponent from "./shared/sidebar/residente-sidebar/residente-sidebar.component";
//import { SidebarComponent } from "./shared/sidebar/sidebar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, CommonModule],
 // templateUrl: './app.component.html',
 // styleUrls: ['./app.component.css'],
  template: `
  <div class="flex min-h-screen">
      <!-- sidebar solo si showSidebar===true -->
      <app-sidebar *ngIf="showSidebar" class="w-72 flex-shrink-0"></app-sidebar>
      <!-- contenido principal -->
      <div class="flex-1">
        <router-outlet></router-outlet>
      </div>
    </div>
  `*/
})
export class AppComponent {
  title = 'mi-casita-tailwind';

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
