import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { RegistroService } from '../services/registro.service';
import Swal from 'sweetalert2';
<<<<<<< HEAD

=======
import SidebarComponent from '../shared/Menu_Lateral/administrador-sidebar/sidebar.component';
//import { SidebarComponent } from '../shared/sidebar/sidebar.component';
>>>>>>> 9907a2ef3b793537e9cea53f75801e1441bc5579


@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css',
  //providers:[AuthService]
})
export class RegistroComponent implements OnInit{

  formulario!: FormGroup;
  mensajeErrorNombre: string = '';
  usuarios: any[] = [];


  constructor(private fb: FormBuilder, private registroService: RegistroService) {}

  ngOnInit(): void {
    this.formulario = this.fb.group({
      cui: ['', [Validators.required, Validators.pattern(/^\d{13}$/)]],
      nombre: ['', [Validators.required, Validators.minLength(5), this.nombreValidoValidator.bind(this)]],
      correoElectronico: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])\S{6,13}$/)]],
      confirmarContrasena: ['', Validators.required],
      rol: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      numeroCasa: [null, [Validators.required, Validators.min(1), Validators.max(100)]]
    }, {validators: this.passwordsIgualesValidator}
  );
  this.cargarUsuarios();
  // **SUBSCRIBIRNOS A LOS CAMBIOS DEL ROL**
  this.formulario.get('rol')!.valueChanges.subscribe(role => {
    const numCasaCtrl = this.formulario.get('numeroCasa')!;
    if (role === 'ADMINISTRADOR' || role === 'GUARDIA') {
      numCasaCtrl.disable();
      numCasaCtrl.reset();        // opcional: borramos valor anterior
    } else {
      numCasaCtrl.enable();
    }
  });

  this.cargarUsuarios();
  }
  cargarUsuarios() {
  this.registroService.obtenerUsuarios().subscribe({
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
  if (this.formulario.invalid) {
    this.formulario.markAllAsTouched();
    return;
  }

  this.registroService.registrar(this.formulario.value).subscribe({
    next: (respuesta: any) => {
      // Éxito
      Swal.fire({
        icon: 'success',
        title: '¡Registro exitoso!',
        text: `Usuario ${respuesta.usuario} registrado correctamente.`,
        confirmButtonText: 'OK'
      });
      this.formulario.reset();
      this.cargarUsuarios();
    },
    error: (error: any) => {
      console.error('Error al registrar:', error);
      // Puedes extraer mensaje de validación si viene en error.error.errors
      let mensaje = 'Error al registrar, inténtalo de nuevo.';
      if (error.status === 400 && error.error?.errors) {
        const errores = error.error.errors;
        const errorNombre = errores.find((e: any) => e.field === 'nombre');
        if (errorNombre) {
          mensaje = errorNombre.defaultMessage;
        }
      }
      Swal.fire({
        icon: 'error',
        title: '¡Registro fallido!',
        text: mensaje,
        confirmButtonText: 'OK'
      });
    }
  });
}


/*
  registrarUsuario(): void {
    if (this.formulario.valid) {
      this.registroService.registrar(this.formulario.value).subscribe({
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
  }*/

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
  this.registroService.eliminarUsuario(cui).subscribe({
    next: () => this.cargarUsuarios(),
    error: (err) => console.error('Error al eliminar usuario', err)
  });
  this.cargarUsuarios();
}
}
