import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter }        from '@angular/router';
import { routes } from './app/app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideZoneChangeDetection } from '@angular/core';
import { AuthInterceptor } from './app/auth/auth/auth-interceptor/auth-interceptor';


bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([AuthInterceptor])),
    provideZoneChangeDetection({ eventCoalescing: true })
  ]
}).catch(err => console.error(err));

