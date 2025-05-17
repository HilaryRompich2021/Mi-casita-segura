import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import * as jwt_decode                  from 'jwt-decode';
import Swal from 'sweetalert2';



interface JWTPayload {
  sub: string;
  cui: string;
  roles: string[];
  // …otros campos de tu token…
}

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ ReactiveFormsModule,CommonModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export default class AuthComponent  {

  loginForm!: FormGroup;
  errorMessage = '';
  welcomeMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      usuario: ['', Validators.required],
      contrasena: ['', Validators.required],
    });
  }

  onSubmit() {
    this.errorMessage = '';
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.auth.login(this.loginForm.value).subscribe({
      next: (res) => {
        //guarda token
        this.auth.setToken(res.token);

         // 2) Decodificar el payload
      const parts = res.token.split('.');
      let decoded: any = {};
      if (parts.length === 3) {
        try {
          decoded = JSON.parse(atob(parts[1]));
        } catch {
          console.warn('Error parsing JWT payload');
        }
        console.log("JWT payload:", decoded);
      }


      // prepara nombre  y roles
      const userName = decoded.sub ?? 'usuario';

      const roleClaim = decoded.roles ?? decoded.rol ?? decoded.role ?? [];
      // Asegúrate de tener siempre un array:
      const roles: string[] = Array.isArray(roleClaim) ? roleClaim : [roleClaim];
      //const roles: string[] = decoded.roles || [];

      //Alerta de bienvenida
      Swal.fire({
          title: `¡Bienvenido ${userName}!`,
          icon: 'success',
          confirmButtonText: 'Aceptar',
          allowOutsideClick: false
        }).then(() => {
          //Al cerrar alerta, dirigir según rol
          if (roles.includes('ADMINISTRADOR')) {
          this.router.navigate(['/menu']);
        } else if (roles.includes('RESIDENTE')){
          this.router.navigate(['/registro']);
        } else {
          this.router.navigate(['/visitantes'])
        }
        });
      },
      error: (err) => {
        // err.error es la cadena que devuelve tu backend: "17 …", "18 …", etc.
        this.errorMessage = err.error || 'Error de conexión, inténtalo de nuevo.';
      }
    });
  }

}
