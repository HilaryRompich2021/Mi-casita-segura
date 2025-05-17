import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/ui/header/header.component';
import { CommonModule } from '@angular/common';
import SidebarComponent from './shared/sidebar/sidebar.component';
import { filter } from 'rxjs';
import HomeComponent from './home/home.component';
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
  `


})
export class AppComponent {
  title = 'mi-casita-tailwind';

  showSidebar = true;

  constructor(private router: Router) {
    // cada vez que cambie de ruta, compruebo si debo ocultar el sidebar
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        // Si la ruta empieza por '/auth', ocultarlo
        this.showSidebar = !this.router.url.startsWith('/auth');
      });
  }
}
