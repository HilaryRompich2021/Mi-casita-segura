import { Component, OnInit } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { UsuarioListadoDTO } from '../models/usuario-listado.dto';
import { DirectorioService } from '../services/directorio.service';

@Component({
  selector: 'app-directorio',
  imports: [ NgIf, NgForOf ], 
  templateUrl: './directorio.component.html',
  styleUrl: './directorio.component.css'
})

export default class DirectorioComponent implements OnInit {
  
  residentes: UsuarioListadoDTO[] = [];
  adminGuardias: UsuarioListadoDTO[] = [];
  searchTerm = '';

  constructor(private directorioService: DirectorioService) { }

  ngOnInit(): void {
    this.directorioService.listaDefault()
      .subscribe({
        next: data => this.adminGuardias = data,
        error: err => {
          console.error(err);
          this.adminGuardias = [];
        }
      });
  }

  buscar(): void {
    const q = this.searchTerm.trim();
    if (q) {
      this.directorioService.buscar(q)
        .subscribe({
          next: data => {
            // Filtrar solo RESIDENTES
            console.log('BUSCAR', data);
            this.residentes = data.filter(u => u.roles.includes('RESIDENTE'));
          },
          error: err => {
            console.error(err);
            this.residentes = [];
          }
        });
    } else {
      // Al borrar búsqueda, limpiamos tabla de residentes
      this.residentes = [];
    }
  }
}
