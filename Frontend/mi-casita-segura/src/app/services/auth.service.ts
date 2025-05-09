import { HttpClient } from '@angular/common/http';
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
export class AuthService {
  [x: string]: any;
  private baseUrl = 'http://localhost:8080/api/usuarios';

  constructor(private http: HttpClient) {}

  registrar(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/registrar`, data);
  }
}
