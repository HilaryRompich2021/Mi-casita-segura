import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './../../enviroments/enviroment';

@Injectable({ providedIn: 'root' })
export class AccesoService {

  private baseUrl = `${environment.apiUrl}/acceso`;
  constructor(private http: HttpClient) {}

  validarEntrada(codigo: string) {
    //return this.http.post<void>(`http://localhost:8080/api/acceso/entrada/${codigo}`, {});
    return this.http.post<void>(`${this.baseUrl}/entrada/${codigo}`, {});
  }

  validarSalida(codigo: string) {
    //return this.http.post<void>(`http://localhost:8080/api/acceso/salida/${codigo}`, {});
    return this.http.post<void>(`${this.baseUrl}/salida/${codigo}`, {});
  }
}
