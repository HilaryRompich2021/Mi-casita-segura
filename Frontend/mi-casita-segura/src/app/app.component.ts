import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/ui/header/header.component';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './shared/ui/header/header.component';
import SidebarComponent from './shared/sidebar/sidebar.component';
import { Subscription } from 'rxjs';
import { WebSocketService } from './services/web-socket.service';
import { filter } from 'rxjs';
import HomeComponent from './home/home.component';
//import { SidebarComponent } from "./shared/sidebar/sidebar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
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
  `


})
export class AppComponent implements OnInit, OnDestroy {
  title = 'mi-casita-tailwind';
  private wsSub!: Subscription;

  constructor(private wsService: WebSocketService) {}

  ngOnInit() {
    this.wsSub = this.wsService.onMessage().subscribe(msg => {
      console.log('[WS recibido]:', msg);
    });
  }

  ngOnDestroy() {
    this.wsSub.unsubscribe();
    this.wsService.close();
  }
}

  showSidebar = false;
  rol: string = '';

  constructor(private router: Router) {
  this.router.events
    .pipe(filter(e => e instanceof NavigationEnd))
    .subscribe(() => {
      const token = localStorage.getItem('auth_token');
      const payload = token ? JSON.parse(atob(token.split('.')[1])) : {};
      this.rol = payload.roles?.[0] || '';
      this.showSidebar = !this.router.url.startsWith('/auth');
    });
}
 /* constructor(private router: Router) {
  this.router.events
    .pipe(filter(e => e instanceof NavigationEnd))
    .subscribe(() => {

      const payload = JSON.parse(atob((localStorage.getItem('auth_token') || '').split('.')[1]));
      this.rol = payload.roles?.[0]; // ✅ Asegura que siempre se actualice
      this.showSidebar = !this.router.url.startsWith('/auth') && this.rol === 'ADMINISTRADOR';
    });
}*/

  /*
  constructor(private router: Router) {
    // cada vez que cambie de ruta, compruebo si debo ocultar el sidebar
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
        this.rol = usuario.rol;

        const rutaEsAuth = this.router.url.startsWith('/auth');
        const esAdministrador = this.rol === 'ADMINISTRADOR';
        // Si la ruta empieza por '/auth', ocultarlo
        //this.showSidebar = !this.router.url.startsWith('/auth');
        this.showSidebar = !rutaEsAuth && esAdministrador;
      });
  }

  rol: string = '';
*/
ngOnInit() {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  this.rol = usuario.rol;
}

}
