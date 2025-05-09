import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/ui/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  /*template: `
    <app-header></app-header>
    <router-outlet></router-outlet>
  `,*/
})
export class AppComponent {
  title = 'mi-casita-tailwind';
}
