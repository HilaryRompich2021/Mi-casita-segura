
import { Routes }           from '@angular/router';


export const routes: Routes = [
  { path: '',       redirectTo: 'auth', pathMatch: 'full' },

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

  {
    path: '**',
    redirectTo: 'auth',
  },

];
