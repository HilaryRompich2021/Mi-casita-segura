import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioListadoDTO } from '../models/usuario-listado.dto';

@Injectable({ providedIn: 'root' })
export class DirectorioService {
  private baseUrl = 'http://localhost:8080/api/directorio';

  constructor(private http: HttpClient) { }

  /** Lista por defecto: administradores + guardias */
   listaDefault(): Observable<UsuarioListadoDTO[]> {
   return this.http.get<UsuarioListadoDTO[]>(this.baseUrl);
 }

  /** Búsqueda por término (param q) */
  buscar(q: string): Observable<UsuarioListadoDTO[]> {
    const params = new HttpParams().set('q', q);
    return this.http.get<UsuarioListadoDTO[]>(this.baseUrl, { params });
  }
}
