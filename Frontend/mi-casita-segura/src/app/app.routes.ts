
import { Routes }           from '@angular/router';
import HomeComponent from './home/home.component';


export const routes: Routes = [

  { path: '',       redirectTo: 'auth', pathMatch: 'full' },

    { path: 'menu', component: HomeComponent },

  /* {path: 'menuResidente',
      loadComponent: () => import('./shared/sidebar/residente-sidebar/residente-sidebar.component')
    },*/

    { path: 'home',
      loadComponent: () => import('./shared/sidebar/sidebar.component')
     },
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
    path: 'visitantes',

    loadComponent: () => import('./visitante/visitante/visitante.component').then(m => m.default)

  },
  {
    path: 'pagos',

    loadComponent: () => import('./pagos/pagos.component').then(m => m.default)

  },

  {
    path: '**',
    redirectTo: 'auth',
  }
];
