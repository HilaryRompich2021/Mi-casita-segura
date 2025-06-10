
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


interface AuthResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  ///[x: string]: any;
  //private baseUrl = 'http://localhost:8080/api/auth';
  private baseUrl = `${environment.apiUrl}/auth`;
  private tokenKey = 'auth_token';

  constructor(private http: HttpClient){
    this.limpiarTokenExpirado();
  }

  /** POST /api/auth/login */
  login(credentials: { usuario: string; contrasena: string }): Observable<AuthResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<AuthResponse>(
      `${this.baseUrl}/login`,
      credentials,
      { headers }
    );
  }

  setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  /** Recupera el JWT de localStorage */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /** Cerrar sesión */
  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  getUserFromToken(): any {
    const token = this.getToken();
    if (!token) {
      return {};
    }
    try {
      // El payload está entre el segundo y tercer punto del JWT
      const payloadBase64 = token.split('.')[1];
      // atob decodifica Base64 → String JSON
      const payloadJson = atob(payloadBase64);
      return JSON.parse(payloadJson);
    } catch (e) {
      console.error('Error al decodificar token JWT:', e);
      return {};
    }
  }

   /** Si el token guardado ya expiró, lo elimina de inmediato */
  private limpiarTokenExpirado() {
    const token = this.getToken();
    if (!token) {
      return;
    }

    // Extraer "exp" del payload del JWT
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      const ahora = Math.floor(Date.now() / 1000);

      if (decoded.exp && decoded.exp <= ahora) {
        // Si expiró, lo borro
        this.logout();
      }
    } catch {
      // Si no se puede decodificar, también borra para evitar errores
      this.logout();
    }
  }

  getCurrentUserData(): any {
    const token = localStorage.getItem(this.tokenKey);
    if (!token) {
      return {};
    }

    try {
      // El payload está en la segunda parte del JWT (separado por puntos)
      const payloadBase64 = token.split('.')[1];
      const decodedJson = atob(payloadBase64);
      return JSON.parse(decodedJson);
    } catch (e) {
      console.error('Error al decodificar JWT:', e);
      return {};
    }
  }

}


