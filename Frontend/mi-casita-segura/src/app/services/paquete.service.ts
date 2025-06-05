import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface PaqueteRegistroDTO {
  empresaDeEntrega: string;
  numeroDeGuia: string;
  tipoDePaquete: string;
  observacion: string;
}

export interface CodigoDTO {
  codigo: string;
}

export interface PaqueteResponse {
  codigo: string;
  empresaDeEntrega: string;
  numeroDeGuia: string;
  tipoDePaquete: string;
  observacion: string;
  fechaRegistro: string;
  fechaExpiracion: string;
  fechaRecepcion: string | null;
  fechaEntrega: string | null;
  estado: 'REGISTRADO' | 'PENDIENTE_A_RECOGER' | 'ENTREGADO';
  creadoPor: {
    cui: string;
    usuario: string;
    nombre: string;
    numeroCasa: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class PaqueteService {
private baseUrl = 'http://localhost:8080/api/paquetes';

  constructor(private http: HttpClient) { }

  /** Registra un nuevo paquete (residente) */
  registrarPaquete(dto: PaqueteRegistroDTO): Observable<PaqueteResponse> {
    return this.http.post<PaqueteResponse>(
      `${this.baseUrl}/registrar`,
      dto,
      this._authHeaders()
    );
  }

  /** El guardia valida la llegada en garita */
  validarIngreso(codigo: string): Observable<PaqueteResponse> {
    return this.http.post<PaqueteResponse>(
      `${this.baseUrl}/validar-ingreso`,
      { codigo },
      this._authHeaders()
    );
  }

  /** El guardia valida la entrega final */
  validarEntrega(
    codigo: string,
    nombreGuardia: string
  ): Observable<PaqueteResponse> {
    // Construimos HttpParams con el query-param nombreGuardia
    const params = new HttpParams().set('nombreGuardia', nombreGuardia);

    return this.http.post<PaqueteResponse>(
      `${this.baseUrl}/validar-entrega`,
      { codigo },                            // body JSON
      {
        ...this._authHeaders(),
        params: params                       // ?nombreGuardia=...
      }
    );
  }
/*  validarEntrega(codigo: string): Observable<PaqueteResponse> {
    return this.http.post<PaqueteResponse>(
      `${this.baseUrl}/validar-entrega`,
      { codigo },
      this._authHeaders()
    );
  }*/

  /** Construye headers con el Bearer token, tal como tu AuthInterceptor espera */
  private _authHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('auth_token') || '';
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : ''
      })
    };
  }

  /** *** MÉTODO SOLICITADO ***
   * Obtiene todos los paquetes del residente autenticado.
   */
  obtenerMisPaquetes(): Observable<PaqueteResponse[]> {
    return this.http.get<PaqueteResponse[]>(
      `${this.baseUrl}/mis-paquetes`,
      this._authHeaders()
    );
  }
}
