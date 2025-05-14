
import { Routes }           from '@angular/router';


export const routes: Routes = [
  { path: '',       redirectTo: 'auth', pathMatch: 'full' },
   {
    path: 'auth',
    loadComponent: () => import('./auth/auth/auth.component').then(m => m.default)

  },
  {
    path: 'registro',
    //loadChildren: () => import('./auth/registro/registro.route'),
    loadComponent: () => import('./registro/registro.component').then(m => m.default)

  },

  {
    path: '**',
    redirectTo: 'auth',
  }
];
