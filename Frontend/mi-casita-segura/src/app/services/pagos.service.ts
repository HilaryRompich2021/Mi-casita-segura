import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagoConsultaDTO } from '../pagos/dto/pago-consulta.dto';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

export interface AguaCargoDTO {
  cui: string;
  metrosCubicosUsados: number;
  estadoPago: string; // normalmente "PENDIENTE"
}

@Injectable({
  providedIn: 'root'
})
export class PagosService {
 // private baseUrl = 'http://localhost:8080/api/pagos';
 private baseUrl = `${environment.apiUrl}/pagos`;

  constructor(private http: HttpClient, private authService: AuthService) {}

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

  obtenerCuotasPendientes(cui: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/pendientes/${cui}`);
  }

  registrarPago(pagoData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/registrarPago`, pagoData);
  }

   obtenerTodosLosPagos(cui: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/todos/${cui}`);
}

getPagosPorCui(cui: string): Observable<PagoConsultaDTO[]> {
  return this.http.get<PagoConsultaDTO[]>(`${this.baseUrl}/listar/${cui}`);
}

generarCargoAgua(dto: AguaCargoDTO): Observable<string> {
    return this.http.post(
      `${this.baseUrl}/cargo-agua`,
      dto,
      {
        ...this.authHeaders(),
        responseType: 'text' // << importante
      }
    );
  }


}
