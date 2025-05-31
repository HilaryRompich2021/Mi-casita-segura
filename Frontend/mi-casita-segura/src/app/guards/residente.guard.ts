// src/app/guards/residente.guard.ts

import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResidenteGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    const payload = this.auth['getUserFromToken']();
    const roles: string[] = Array.isArray(payload.roles) ? payload.roles : [];

    if (roles.includes('RESIDENTE')) {
      return true;
    }

    return this.router.createUrlTree(['/']);
  }
}
