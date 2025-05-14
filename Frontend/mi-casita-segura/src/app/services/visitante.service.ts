import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface VisitanteRegistroDTO {
  cui: string;
  nombreVisitante: string;
  telefono: string;
  numeroCasa: number;
  motivoVisita: string;
  nota: string;
  creadoPor: string;
}

export interface VisitanteListadoDTO {
  id: number;
  cui: string;
  nombreVisitante: string;
  estado: boolean;
  fechaDeIngreso: string;    // ISO-8601
  telefono: string;
  numeroCasa: number;
  motivoVisita: string;
  nota: string;
  creadoPorCui: string;
}

// Entidad completa (para POST/PUT  devuelve Visitante completo)
export interface Visitante {
  id: number;
  cui: string;
  nombreVisitante: string;
  estado: boolean;
  fechaDeIngreso: string;
  telefono: string;
  numeroCasa: number;
  motivoVisita: string;
  nota: string;
  creadoPor: {
    cui: string;
    nombre: string;
    // …otros campos del Usuario si los necesitas…
  };
  acceso_QR: {
    id: number;
    codigoQR: string;
    fechaGeneracion: string;
    estado: string;
    fechaExpiracion: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class VisitanteService {
  private baseUrl = '/api/visitantes';


  constructor(private http: HttpClient) { }

  /** Crea un visitante */
  registrarVisitante(dto: VisitanteRegistroDTO): Observable<Visitante> {
    return this.http.post<Visitante>(`${this.baseUrl}/registro`, dto);
  }

  /** Lista todos los visitantes */
  listarVisitantes(): Observable<VisitanteListadoDTO[]> {
    return this.http.get<VisitanteListadoDTO[]>(this.baseUrl);
  }

  /** Actualiza un visitante existente */
  actualizarVisitante(id: number, dto: VisitanteRegistroDTO): Observable<Visitante> {
    return this.http.put<Visitante>(`${this.baseUrl}/${id}`, dto);
  }
}
