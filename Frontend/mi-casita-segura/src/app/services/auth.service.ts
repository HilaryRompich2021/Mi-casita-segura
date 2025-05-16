import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface AuthResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  [x: string]: any;
  private baseUrl = 'http://localhost:8080/api/auth';
  private tokenKey = 'auth_token';

  constructor(private http: HttpClient
              //private  authService: AuthService

  ){}

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
}


