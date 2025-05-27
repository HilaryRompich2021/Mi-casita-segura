import { Routes }           from '@angular/router';
<<<<<<< HEAD
=======
import HomeComponent from './shared/Pages - Bienvenida/Bienvenida_Administrador/Home/home.component';
//import HomeComponent from './shared/Pages - Bienvenida/Bienvenida_Administrador/home.component';
//import HomeComponent from './shared/Pages - Bienvenida/Bienvenida_Administrador/home/home.component';
>>>>>>> 9907a2ef3b793537e9cea53f75801e1441bc5579

export const routes: Routes = [
  { path: '',       redirectTo: 'auth', pathMatch: 'full' },

<<<<<<< HEAD
  {
=======
//BIENVENIDA AL SISTEMA
    { path: 'BienvenidaAdmin', component: HomeComponent },


//Menu lateral de Administrador
    { path: 'home',
      loadComponent: () => import('./shared/Menu_Lateral/administrador-sidebar/sidebar.component')
     },

   {
>>>>>>> 9907a2ef3b793537e9cea53f75801e1441bc5579
    path: 'auth',
    loadComponent: () =>
      import('./auth/auth/auth.component').then(m => m.AuthComponent)
  },

  // 3) Registro
  {
    path: 'registro',
    loadComponent: () =>
      import('./registro/registro.component').then(m => m.RegistroComponent)
  },

  // 4) Visitantes
  {
    path: 'visitantes',
    loadComponent: () =>
      import('./visitante/visitante/visitante.component').then(m => m.RegistroVisitanteComponent)
  },

  // 5) Home (página principal)—usa el HomeComponent, no el sidebar
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.component').then(m => m.HomeComponent)
  },

  // 6) Pagos
  {
    path: 'pagos',
    loadComponent: () =>
      import('./pagos/pagos.component').then(m => m.PagosComponent)
  },

  // 7) Scanner QR (entrada y salida)
  {
    path: 'scanner-qr/entrada',
    loadComponent: () =>
      import('./qr-scanner/qr-scanner.component').then(m => m.ScannerQrComponent),
    data: { esEntrada: true }
  },
  {
    path: 'scanner-qr/salida',
    loadComponent: () =>
      import('./qr-scanner/qr-scanner.component').then(m => m.ScannerQrComponent),
    data: { esEntrada: false }
  },

  // 8) Ruta comodín
  { path: '**', redirectTo: 'auth' }
];
