import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/ui/header/header.component';
import { CommonModule } from '@angular/common';
import SidebarComponent from './shared/sidebar/sidebar.component';
//import { SidebarComponent } from "./shared/sidebar/sidebar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  template: `<router-outlet></router-outlet>`,
  /*template: `
    <app-header></app-header>
    <router-outlet></router-outlet>
  `,*/


})
export class AppComponent {
  title = 'mi-casita-tailwind';
}
