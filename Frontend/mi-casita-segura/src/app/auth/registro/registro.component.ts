import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css',
  //providers:[AuthService]
})
export default class RegistroComponent implements OnInit{

  formulario!: FormGroup;
  mensajeErrorNombre: string = '';
  usuarios: any[] = [];


  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit(): void {
    this.formulario = this.fb.group({
      cui: ['', [Validators.required, Validators.pattern(/^\d{13}$/)]],
      nombre: ['', [Validators.required, Validators.minLength(5), this.nombreValidoValidator.bind(this)]],
      correoElectronico: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])\S{6,13}$/)]],
      confirmarContrasena: ['', Validators.required],
      rol: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      numeroCasa: [null, [Validators.required, Validators.min(1), Validators.max(300)]]
    }, {validators: this.passwordsIgualesValidator}
  );
  this.cargarUsuarios();
  }
  cargarUsuarios() {
  this.authService.obtenerUsuarios().subscribe({
    next: (data) => this.usuarios = data,
    error: (err) => console.error('Error al obtener usuarios', err)
  });
}


  passwordsIgualesValidator(group: AbstractControl): ValidationErrors | null {
  const password = group.get('contrasena')?.value;
  const confirm = group.get('confirmarContrasena')?.value;
  return password === confirm ? null : { passwordsMismatch: true };
}


  registrarUsuario(): void {
    if (this.formulario.valid) {
      this.authService.registrar(this.formulario.value).subscribe({
        next: (respuesta: any) => {console.log('Registrado:', respuesta);
          this.mensajeErrorNombre = ''; // Limpia errores anteriores
        },
        error: (error: any) => {console.error('Error al registrar:', error);

          if (error.status === 400 && error.error?.errors) {
      const errores = error.error.errors;

      const errorNombre = errores.find((e: any) => e.field === 'nombre');
      if (errorNombre) {
        this.mensajeErrorNombre = errorNombre.defaultMessage;
      }
    }
        }
      });
    }
  }

  nombreValidoValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value || value.trim() === '') return { nombreInvalido: true };

  const palabras = value.trim().split(/\s+/);
  if (palabras.length < 2) return { nombreInvalido: true };

  for (const palabra of palabras) {
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ]{2,}$/.test(palabra)) {
      return { nombreInvalido: true };
    }
  }

  return null;
}

eliminarUsuario(cui: string) {
  this.authService.eliminarUsuario(cui).subscribe({
    next: () => this.cargarUsuarios(),
    error: (err) => console.error('Error al eliminar usuario', err)
  });
  this.cargarUsuarios();
}
}
