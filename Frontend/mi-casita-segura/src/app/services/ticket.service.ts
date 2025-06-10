import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface TicketSoporteDTO {
  id: number;
  tipoError: string;
  descripcion: string;
  estado: string;
  fechaCreacion: string;     // ISO string
  fechaActualizacion: string; // ISO string
  usuarioCui: string;
  usuarioNombre: string;
}

export interface CreateTicketRequest {
  tipoError: string;
  descripcion: string;
}

export interface UpdateEstadoRequest {
  ticketId: number;
  detalle: string;
}

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  //private baseUrl = 'http://localhost:8080/api/tickets';
  private baseUrl = `${environment.apiUrl}/tickets`;

  constructor(private http: HttpClient) { }

   private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || ''; // o donde guardes el JWT
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
  }

  listarTickets(): Observable<TicketSoporteDTO[]> {
    return this.http.get<TicketSoporteDTO[]>(`${this.baseUrl}`);
  }

  crearTicket(dto: CreateTicketRequest): Observable<TicketSoporteDTO> {
    const headers = this.getAuthHeaders();
    return this.http.post<TicketSoporteDTO>(`${this.baseUrl}`, dto, { headers });
  }

  ponerEnProceso(dto: UpdateEstadoRequest): Observable<TicketSoporteDTO> {
    const headers = this.getAuthHeaders();
    return this.http.put<TicketSoporteDTO>(`${this.baseUrl}/en-proceso`, dto);
  }

  completarTicket(dto: UpdateEstadoRequest): Observable<TicketSoporteDTO> {
    const headers = this.getAuthHeaders();
    return this.http.put<TicketSoporteDTO>(`${this.baseUrl}/completar`, dto);
  }

  obtenerPorId(id: number): Observable<TicketSoporteDTO> {
    const headers = this.getAuthHeaders();
    return this.http.get<TicketSoporteDTO>(`${this.baseUrl}/${id}`);
  }
}
