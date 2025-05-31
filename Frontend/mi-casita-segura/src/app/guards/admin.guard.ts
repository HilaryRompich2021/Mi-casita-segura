// src/app/guards/admin.guard.ts

import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router';
import { AuthService } from '../services/auth.service'; // Asegúrate de la ruta correcta
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    // 1) Extrae el payload (roles, cui, etc.) del token
    const payload = this.auth['getUserFromToken']();  
    //    ↳ getUserFromToken() sería un método en AuthService que decodifica el JWT y retorna un objeto
    //         por ejemplo: { cui: "...", roles: ['ADMINISTRADOR', ...], numeroCasa: ..., sub: "...", ... }

    // 2) Comprueba si “roles” contiene "ADMINISTRADOR"
    const roles: string[] = Array.isArray(payload.roles) ? payload.roles : [];

    if (roles.includes('ADMINISTRADOR')) {
      // Si tiene el rol correcto, dejo pasar
      return true;
    }

    // 3) Si NO tiene rol → redirijo a “/unauthorized” (o a donde quieras)
    return this.router.createUrlTree(['/BienvenidaAdmin']);
  }
}
