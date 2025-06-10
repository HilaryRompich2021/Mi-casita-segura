import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ReservaDTO {
  cui: string;
  areaComun: 'Piscina' | 'Cancha' | 'Salón';
  fecha: string;       // formato YYYY-MM-DD
  horaInicio: string;  // formato HH:mm:ss
  horaFin: string;     // formato HH:mm:ss
}

export interface ReservaListadoDTO {
  id: number;
  //cuiResidente: string
  areaComun: string;
  fecha: string;       // YYYY-MM-DD
  horaInicio: string;  // HH:mm:ss
  horaFin: string;     // HH:mm:ss
  estado: string;      // "RESERVADO"
  costoTotal: number;  // Q calculado
}


@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  //private baseUrl = 'http://localhost:8080/api/reservas';
  private baseUrl = `${environment.apiUrl}/reservas`;

  constructor(private http: HttpClient) { }

crearReserva(dto: ReservaDTO): Observable<string> {
    // Aquí le indicamos a HttpClient que el tipo de respuesta es texto plano
    return this.http.post(`${this.baseUrl}/crear`, dto, {
      responseType: 'text'
    });
  }

  listarPropias(cui: string): Observable<ReservaListadoDTO[]> {
    return this.http.get<ReservaListadoDTO[]>(`${this.baseUrl}/propias/${cui}`);
  }

  // Antes tenías listarTodas(); ahora la renombramos/listamos solo confirmadas:
  listarConfirmadas(): Observable<ReservaListadoDTO[]> {
    return this.http.get<ReservaListadoDTO[]>(`${this.baseUrl}/todas-confirmadas`);
  }

}
