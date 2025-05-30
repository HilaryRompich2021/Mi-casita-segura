import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagoConsultaDTO } from '../pagos/dto/pago-consulta.dto';

@Injectable({
  providedIn: 'root'
})
export class PagosService {
  private baseUrl = 'http://localhost:8080/api/pagos';
  constructor(private http: HttpClient) {}

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




}
