import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

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
  private baseUrl = 'http://localhost:8080/api/visitantes';


  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  /** Construye los headers con el Bearer token */
  private authHeaders(): { headers: HttpHeaders } {
    const token = this.authService.getToken();  // usar authService
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : ''
      })
    };
  }

  /** POST registro visitante*/
  registrar(dto: VisitanteRegistroDTO): Observable<VisitanteListadoDTO> {
    return this.http.post<VisitanteListadoDTO>(`${this.baseUrl}/registro`, dto, this.authHeaders());
  }
  

  /** GET administrador, todos */
  listar(): Observable<VisitanteListadoDTO[]> {
    return this.http.get<VisitanteListadoDTO[]>(this.baseUrl,this.authHeaders());
  }

  /** PUT actualizar visitante admin */
  actualizar(id: number, dto: VisitanteRegistroDTO): Observable<VisitanteListadoDTO> {
    return this.http.put<VisitanteListadoDTO>(`${this.baseUrl}/${id}`, dto,this.authHeaders());
  }

  //GET visitantes que residente creo
  listarPropios(): Observable<VisitanteListadoDTO[]> {
    return this.http.get<VisitanteListadoDTO[]>(`${this.baseUrl}/propios`,this.authHeaders());
  }

}