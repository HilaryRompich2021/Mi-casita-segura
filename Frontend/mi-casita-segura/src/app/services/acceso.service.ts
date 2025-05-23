import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AccesoService {
  constructor(private http: HttpClient) {}

  validarEntrada(codigo: string) {
    return this.http.post<void>(`http://localhost:8080/api/acceso/entrada/${codigo}`, {});
  }

  validarSalida(codigo: string) {
    return this.http.post<void>(`http://localhost:8080/api/acceso/salida/${codigo}`, {});
  }
}
