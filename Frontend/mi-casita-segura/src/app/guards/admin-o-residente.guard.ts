import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  UrlTree,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminOResidenteGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    // 1) Extraigo el payload del JWT
    const payload = this.authService.getUserFromToken();
    const roles: string[] = Array.isArray(payload.roles) ? payload.roles : [];

    // 2) Permito si es ADMINISTRADOR O si es RESIDENTE
    if (roles.includes('ADMINISTRADOR') || roles.includes('RESIDENTE')) {
      return true;
    }

    // 3) Si no cumple ninguno, redirijo a "/"
    return this.router.createUrlTree(['/']);
  }
}
