import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  HttpClientModule,
  provideHttpClient,
  withInterceptors
} from '@angular/common/http';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

import { DirectorioService } from '../services/directorio.service';
import { UsuarioListadoDTO } from '../models/usuario-listado.dto';
import { AuthInterceptor } from '../auth/auth/auth-interceptor/auth-interceptor';

@Component({
  selector: 'app-directorio',
  standalone: true,
  imports: [ CommonModule, HttpClientModule],
  providers: [
      // JWT helper
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService
  ],
  templateUrl: './directorio.component.html',
  styleUrls: ['./directorio.component.css']
})
export default class DirectorioComponent implements OnInit {
  residentes: UsuarioListadoDTO[] = [];
  adminGuardias: UsuarioListadoDTO[] = [];
  searchTerm = '';

  constructor(
    private directorioService: DirectorioService,
    private jwtHelper: JwtHelperService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('auth_token');
    if (!token || this.jwtHelper.isTokenExpired(token)) {
      this.router.navigate(['/login']);
      return;
    }
    // Carga admins/guardias
    this.directorioService.listaDefault().subscribe({
      next: data => this.adminGuardias = data,
      error: err => console.error('Error admins/guardias:', err)
    });
  }

  buscar(): void {
    const q = this.searchTerm.trim();
    if (!q) {
      this.residentes = [];
      return;
    }
    this.directorioService.buscar(q).subscribe({
      next: data => {
        this.residentes = data.filter(u => u.rol === 'RESIDENTE');
      },
      error: err => {
        console.error('Error buscando residentes:', err);
        this.residentes = [];
      }
    });
  }
}
