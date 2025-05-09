
import { Routes }           from '@angular/router';


export const routes: Routes = [
  { path: '',       redirectTo: 'registro', pathMatch: 'full' },
  {
    path: 'registro',
    //loadChildren: () => import('./auth/registro/registro.route'),
    loadComponent: () => import('./auth/registro/registro.component').then(m => m.default)

  },
  {
    path: '**',
    redirectTo: 'registro',
  }
];
