import { Routes }           from '@angular/router';
import HomeComponent from './shared/Pages - Bienvenida/Bienvenida_Administrador/Home/home.component';
//import HomeComponent from './shared/Pages - Bienvenida/Bienvenida_Administrador/home.component';
//import HomeComponent from './shared/Pages - Bienvenida/Bienvenida_Administrador/home/home.component';

export const routes: Routes = [

  { path: '',       redirectTo: 'auth', pathMatch: 'full' },

//BIENVENIDA AL SISTEMA
    { path: 'BienvenidaAdmin', component: HomeComponent },


//Menu lateral de Administrador
  { path: 'home',
    loadComponent: () => import('./shared/Menu_Lateral/administrador-sidebar/sidebar.component').then(m => m.default)
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
