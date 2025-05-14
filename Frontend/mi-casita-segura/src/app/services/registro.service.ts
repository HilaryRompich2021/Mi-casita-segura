import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface RegistroDTO {
  cui: string;
  nombre: string;
  correoElectronico: string;
  contrasena: string;
  rol: string; // ADMINISTRADOR, RESIDENTE, GUARDIA
  telefono: string;
  numeroCasa: number;
}


@Injectable({
  providedIn: 'root'
})
export class RegistroService {
  private baseUrl = 'http://localhost:8080/api/usuarios';


  constructor(private http: HttpClient) {}

  registrar(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.baseUrl}/registrar`, data);
  }

  obtenerUsuarios(): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}`);
}

eliminarUsuario(cui: string): Observable<any> {
  return this.http.delete(`${this.baseUrl}/${cui}`);
}
}
