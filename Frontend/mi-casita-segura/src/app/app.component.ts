import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './shared/ui/header/header.component';
import SidebarComponent from './shared/sidebar/sidebar.component';
import { Subscription } from 'rxjs';
import { WebSocketService } from './services/web-socket.service';

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